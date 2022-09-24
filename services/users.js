const db = require('./db');
const helper = require('../helper');
const crypto = require('crypto');

const validPassword = function(userPassword, storedPassword, salt) {
    const hash = crypto.pbkdf2Sync(userPassword,
        salt, 1000, 64, `sha512`).toString(`hex`);
    return storedPassword === hash;
};

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
        console.log(userId);
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
    createUser
}