const db = require('./db');
const helper = require('../helper');
const crypto = require('crypto');

const validPassword = function(userPassword, storedPassword, salt) {
    const hash = crypto.pbkdf2Sync(userPassword,
        salt, 1000, 64, `sha512`).toString(`hex`);
    return storedPassword === hash;
};

async function getResetToken(emailId) {
    const rows = await db.query(`select * from z3_user where username = ? `, [emailId]);
    const data = helper.emptyOrRows(rows);
    if (data.length) {
        const userDetails = data[0];
        if (!userDetails.password || !userDetails.salt || userDetails.status === 0) {
            return {message: `User is not active or password not created`, status: 400};
        } else {
            const resetPasswordExpires = Date.now() + 900000; //expires in 15 mins
            const resetPasswordToken = crypto.randomBytes(16).toString('hex');
            const userId = await db.query(`UPDATE z3_user set reset_token = ?, reset_token_expiry = ?, updated_at = current_timestamp() where user_id = ?`, [resetPasswordToken, resetPasswordExpires, userDetails.user_id]);
            return {
                message: `Reset link sent successfully. Please check your email.`,
                token: resetPasswordToken,
                first_name: userDetails.first_name,
                status: 200
            };
        }
    } else {
        return {message: `The email address "${emailId}" is not associated with any account`, status: 400};
    }
}

async function getUserDetailByToken(token) {
    const rows = await db.query(`select  user_id,
        company_legal_name,
        first_name,
        username,
        alt_email_1,
        alt_email_2,
        phone_number,
        financial_year,
        investor_type,
        fund_association,
        created_at,
        updated_at,
        reset_token_expiry,
        status from z3_user where reset_token = ? `, [token]);
    //console.log(`select * from z3_user where reset_token = ${token}`);
    const data = helper.emptyOrRows(rows);
    if (data.length) {
        const userDetails = data[0];
        if (userDetails.status === 0) {
            return {message: `User Account is not active, please contact Z3Partners at partner@z3partners.com`, status: 400};
        } else {
            return {
                message: ``,
                userDetails: userDetails,
                status: 200
            };
        }
    } else {
        return {message: `Invalid data, please contact Z3Partners at partner@z3partners.com`, status: 400};
    }
}

async function createUser(userDetails) {

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(userDetails.password, salt,
        1000, 64, `sha512`).toString(`hex`);

    const rows = await db.query(`select * from z3_user where username = '${userDetails.username}'`);
    const data = helper.emptyOrRows(rows);
    if(data.length) {
        return  {message: "Username exist", status: 400};
    } else {
        const user = await db.query(`INSERT into z3_user (username, password, salt, first_name, phone_number, status) values (?, ?, ?, ?, ?, ?)`,[userDetails.username, hash, salt, userDetails.first_name, userDetails.phone_number, userDetails.status]);
        const userId = user.insertId;
        const userRole = await db.query(`INSERT into z3_user_role_mapping (user_id, role_id) values (?, ?)`,[userId, userDetails.role]);
        return  {message: `User [${userDetails.username}] created `, status: 200};
    }
}
async function isParentUserActive(parent_id) {
    if (parent_id === 0) {
        return true;
    } else {
        const rows = await db.query(`select status from z3_user where user_id = ? and status = 1 `, [parent_id]);
        let data = helper.emptyOrRows(rows);
        return data.length;
    }
}

async function loginUser(username, password) {
    const rows = await db.query(`select * from z3_user where username = ? `, [username]);
    let data = helper.emptyOrRows(rows);
    if (data.length && validPassword(password, data[0].password, data[0].salt)) {
        const isSubUser = await isParentUserActive(data[0].parent_id);
        if (data[0].status === 1 && isSubUser) {
            const roleDetails = await getUserRoleBasedPermission(data[0].user_id);
            const roles = (roleDetails.length) ? roleDetails[0] : {};
            return {message: {userDetail: data[0], roleDetails: roles}, status: 200};
        } else {
                if (data[0].parent_id !== 0) {
                    return {message: "Sub User or Parent User is not active, please contact Z3Partners at partner@z3partners.com.", status: 400};
                }
            return {message: "User Account is not active, please contact Z3Partners at partner@z3partners.com.", status: 400};
        }
    } else {
        return {message: "Incorrect username/password", status: 400};
    }
}

async function changePassword(id, password, newPassword) {
    try {
        const rows = await db.query(`select * from z3_user where user_id = ?`, [id]);
        let data = helper.emptyOrRows(rows);
        if (data.length && validPassword(password, data[0].password, data[0].salt)) {
            const salt = crypto.randomBytes(16).toString('hex');
            const hash = crypto.pbkdf2Sync(newPassword, salt, 1000, 64, `sha512`).toString(`hex`);
            await db.query(`UPDATE z3_user set password = ?, salt = ?, updated_at = current_timestamp() where user_id = ?`, [hash, salt, id]);
            return {message: "Password changed", status: 200};
        } else {
            return {message: "Current password is incorrect", status: 400};
        }
    } catch (err) {
        console.error(`Error while changing password`, err.message);
        return {message: "Error while changing password", status: 500};
    }
}

async function createUserPass(data, userType = 'User') {
    try {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(data.password, salt, 1000, 64, `sha512`).toString(`hex`);

        const response = await db.query(`UPDATE z3_user set password = ?, salt = ?, updated_at = current_timestamp() where user_id = ?`,
            [hash, salt, data.user_id]);
        return {message: `${userType} password created`, status: 200};
    } catch (err) {
        console.error(`Error while creating user password`, err.message);
        return {message: `Error while creating user password`, status: 500};
    }
}

async function getUserRoleBasedPermission(user_id) {
    const rows = await db.query(`
    select 
    uRole.role_id, uRole.role_name, perMap.permission_id
    from z3_user_role_mapping rMap join z3_user_role uRole using(role_id)
    left join z3_role_permission_mapping perMap using(role_id)
    where rMap.user_id = ?
    `, [user_id]);
    return helper.emptyOrRows(rows); 
}

async function listAll(status, searchFields, userType = 'User') {
    let condition = [];
    let conStr = '';
    if(status) {
        condition.push('status = 1');
    }

    if(searchFields.funds) {
        condition.push(`fund_association like '%${searchFields.funds}%'`);
    }

    if(searchFields.parent_id_criteria) {
        condition.push(`${searchFields.parent_id_criteria}`);
    }

    if(condition.length) {
        conStr  =  " and " + condition.join(" and ");
    }

    const rows = await db.query(`select z3_user_role_mapping.role_id,  user_id,
        first_name,
        username,
        phone_number,
        created_at,
        updated_at,
        status from z3_user
        left join z3_user_role_mapping using(user_id) where z3_user_role_mapping.role_id <> 3
    ${conStr}`);
    const data = helper.emptyOrRows(rows);
    if (data.length) {
        return { message: data, status: 200 };
    } else {
        return { message: `${userType} list is empty`, status: 200 };
    }
}

async function getUser(id) {
    const rows = await db.query(`select z3_user_role_mapping.role_id,  user_id,
        first_name,
        username,
        phone_number,
        created_at,
        updated_at,
        status from z3_user
        left join z3_user_role_mapping using(user_id) where user_id = ? `, [id]);
    const res = helper.emptyOrRows(rows);
    if (!res.length) {
        return {message: `User not found`, status: 404};
    } else {
        return {message: res, status: 200};
    }
}
async function updateUser(data) {
    try {
        const response = await db.query(`UPDATE z3_user
        set first_name = ?, phone_number = ?, status = ?, updated_at = current_timestamp()
        where user_id = ?`,
            [data.first_name, data.phone_number, data.status, data.user_id]);

        const userRole = await db.query(`UPDATE z3_user_role_mapping set role_id = ? where user_id = ? `,[data.role_id, data.user_id]);
        return {message: `User updated`, status: 200};
    } catch (err) {
        console.error(`Error while updating user details`, err.message);
        return {message: `Error while updating user details`, status: 500};
    }
}

async function deleteUser(user_id) {
    const userRes = await db.query(`DELETE from z3_user where user_id = ?`, [user_id]);
    const roleRes = await db.query(`DELETE from z3_user_role_mapping where user_id = ?`, [user_id]);
    return {message: `User deleted`, status: 200};
}


async function createSubUser(userDetails) {

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(userDetails.password, salt,
        1000, 64, `sha512`).toString(`hex`);

    const rows = await db.query(`select * from z3_user where username = '${userDetails.username}'`);
    const data = helper.emptyOrRows(rows);
    if(data.length) {
        return  {message: "Username exist", status: 400};
    } else {
        const user = await db.query(`INSERT into z3_user (username, parent_id, password, salt, first_name, phone_number, status) values (?, ?, ?, ?, ?, ?, ?)`,[userDetails.username, userDetails.parent_id, hash, salt, userDetails.first_name, userDetails.phone_number, userDetails.status]);
        const userId = user.insertId;
        const userRole = await db.query(`INSERT into z3_user_role_mapping (user_id, role_id) values (?, ?)`,[userId, 6]);
        return  {message: `Sub user [${userDetails.username}] created `, status: 200};
    }
}

async function updateSubUser(data) {
    try {
        const response = await db.query(`UPDATE z3_user
        set first_name = ?, phone_number = ?, status = ?, updated_at = current_timestamp()
        where user_id = ?`,
            [data.first_name, data.phone_number, data.status, data.user_id]);

        return {message: `Sub User updated`, status: 200};
    } catch (err) {
        console.error(`Error while updating sub user details`, err.message);
        return {message: `Error while updating sub user details`, status: 500};
    }
}

async function deleteSubUser(user_id) {
    const userRes = await db.query(`DELETE from z3_user where user_id = ?`, [user_id]);
    const roleRes = await db.query(`DELETE from z3_user_role_mapping where user_id = ?`, [user_id]);
    return {message: `Sub User deleted`, status: 200};
}
module.exports = {
    loginUser,
    createUser,
    getUser,
    updateUser,
    deleteUser,
    getResetToken,
    getUserDetailByToken,
    listAll,
    createUserPass,
    changePassword,
    createSubUser, updateSubUser, deleteSubUser
}