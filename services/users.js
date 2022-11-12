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
            return {message: `User is not active or password not created!!`, status: 400};
        } else {
            const resetPasswordExpires = Date.now() + 3600000; //expires in an hour
            const resetPasswordToken = crypto.randomBytes(16).toString('hex');
            const userId = await db.query(`UPDATE z3_user set reset_token = ?, reset_token_expiry = ? where user_id = ?`, [resetPasswordToken, resetPasswordExpires, userDetails.user_id]);
            return {
                message: `Reset link sent successfully. Please check your email.`,
                token: resetPasswordToken,
                status: 200
            };
        }
    } else {
        return {message: `The email address "${emailId}" is not associated with any account`, status: 400};
    }
}
async function createUser(userDetails) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(userDetails.password, salt,
        1000, 64, `sha512`).toString(`hex`);

    const rows = await db.query(`select * from z3_user where username = '${userDetails.username}'`);
    const data = helper.emptyOrRows(rows);
    if(data.length) {
        return  {message: "Username exist!!", status: 400};
    } else {
        const userId = await db.query(`INSERT into z3_user (username, password, salt, first_name, last_name) values ('${userDetails.username}', '${hash}', '${salt}', 'Fname', 'Lname', 1)`);
        return  {message: `Username created!!, ${userId}`, status: 200};
    }
}

async function loginUser(username, password) {
    const rows = await db.query(`select * from z3_user where username = ? `, [username]);
    let data = helper.emptyOrRows(rows);
    if(data.length && validPassword(password, data[0].password, data[0].salt)) {
        const roleDetails = await getUserRoleBasedPermission(data[0].user_id);
        const roles = (roleDetails.length) ? roleDetails[0] : {};
        return {message: {userDetail: data[0], roleDetails: roles}, status: 200};
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
            await db.query(`UPDATE z3_user set password = ?, salt = ? where user_id = ?`, [hash, salt, id]);
            return {message: "Password changed", status: 200};
        } else {
            return {message: "Current password is incorrect", status: 400};
        }
    } catch (err) {
        console.error(`Error while changing password`, err.message);
        return {message: "Error while changing password", status: 500};
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

module.exports = {
    loginUser,
    createUser,
    getResetToken,
    changePassword
}