const db = require('./db');
const helper = require('../helper');
const crypto = require('crypto');

async function addInvestor(data) {
    const rows = await db.query(`select username from z3_user where username = ?`, [data.email_id]);
    const res = helper.emptyOrRows(rows);
    if (res.length) {
        return {message: `Investor email id should be unique`, status: 400};
    } else {
        const response = await db.query(`INSERT into z3_user
        (alt_email_1, alt_email_2, company_legal_name, financial_year, investor_type, fund_association, first_name, username, phone_number, status)
        values (?,?,?, ?, ?, ?, ?, ?, ?, ?)`, [data.alt_email_1, data.alt_email_2, data.company_legal_name, data.financial_year, data.investor_type, data.fund_association, data.first_name, data.email_id, data.phone_number, data.status]);
        const roles = await db.query(`INSERT into z3_user_role_mapping (user_id, role_id) values (?, ?)`, [response.insertId, 3]);
        return {message: `Investor created!!`, status: 200};
    }
}

async function getInvestor(id, role_id) {
    const roleId = (role_id) ? role_id : 3;
    const rows = await db.query(`select user_id,
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
        status from z3_user left join z3_user_role_mapping using(user_id)  where user_id = ? and  z3_user_role_mapping.role_id = ?`, [id, roleId]);
    const res = helper.emptyOrRows(rows);
    if (!res.length) {
        return {message: `Investor not found`, status: 404};
    } else {
        return {message: res, status: 200};
    }
}

async function updateProfile(data) {
    try {
        const response = await db.query(`UPDATE z3_user
        set first_name = ?, phone_number = ?, alt_email_1 = ?, alt_email_2 = ?, updated_at = current_timestamp()
        where user_id = ?`,
            [data.first_name, data.phone_number, data.alt_email_1, data.alt_email_2, data.user_id]);
        return {message: `Profile updated!!`, status: 200};
    } catch (err) {
        console.error(`Error while updating profile details`, err.message);
        return {message: `Error while updating profile details`, status: 500};
    }
}

async function updateInvestor(data) {
    try {
        const response = await db.query(`UPDATE z3_user
        set alt_email_1 = ?, alt_email_2 = ?, company_legal_name = ?, financial_year = ?, investor_type = ?, fund_association = ?, first_name = ?, phone_number = ?, status = ?, updated_at = current_timestamp()
        where user_id = ?`,
        [data.alt_email_1, data.alt_email_2, data.company_legal_name, data.financial_year, data.investor_type, data.fund_association, data.first_name, data.phone_number, data.status, data.user_id]);
        return {message: `Investor updated!!`, status: 200};
    } catch (err) {
        console.error(`Error while updating investor details`, err.message);
        return {message: `Error while updating investor details`, status: 500};
    }
}

async function createInvestorPass(data) {
    try {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(data.password, salt, 1000, 64, `sha512`).toString(`hex`);

        const response = await db.query(`UPDATE z3_user set password = ?, salt = ?, updated_at = current_timestamp() where user_id = ?`,
        [hash, salt, data.user_id]);
        return {message: `Investor password created!!`, status: 200};
    } catch (err) {
        console.error(`Error while creating investor password`, err.message);
        return {message: `Error while creating investor password`, status: 500};
    }
}


async function listAll(status, searchFields = {}) {
    let condition = [];
    let conStr = '';
    if(status) {
        condition.push('status = 1');
    }
    if(searchFields.financial_year) {
        condition.push(`financial_year = '${searchFields.financial_year}'`);
    }
    if(searchFields.investor_type) {
        condition.push(`investor_type = '${searchFields.investor_type}'`);
    }
    if(searchFields.funds) {
        condition.push(`fund_association like '%${searchFields.funds}%'`);
    }

    if(condition.length) {
        conStr  =  " and " + condition.join(" and ");
    }
    const rows = await db.query(`select z3_user_role_mapping.role_id,  user_id,
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
        status from z3_user
        left join z3_user_role_mapping using(user_id) where z3_user_role_mapping.role_id = 3
    ${conStr}`);
    const data = helper.emptyOrRows(rows);
    if (data.length) {
        return { message: data, status: 200 };
    } else {
        return { message: "Investor list is empty", status: 200 };
    }
}

async function deleteInvestor(user_id) {
    const response = await db.query(`DELETE from z3_user where user_id = ?`, [user_id]);
    const roleRes = await db.query(`DELETE from z3_user_role_mapping where user_id = ?`, [user_id]);
    return {message: `Investor deleted!!`, status: 200};
}

module.exports = {
    addInvestor, updateInvestor, updateProfile, listAll, getInvestor, deleteInvestor, createInvestorPass
}
