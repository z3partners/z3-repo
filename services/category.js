const db = require('./db');
const helper = require('../helper');


async function createCategory(category, status, parent_id = 0) {
    const insertType = (parent_id === 0) ? "Category" : "Sub category";
    status = (status) ? 1 : 0;
    const rows = await db.query(`select * from z3_document_categories where category_name = ?`, [category]);
    const data = helper.emptyOrRows(rows);
    if (data.length) {
        return {message: `${insertType} should be unique among catgeory and sub category.`, status: 400};
    } else {
        const response = await db.query(`INSERT into z3_document_categories (category_name, status, parent_id) values (?, ?, ?)`, [category, status, parent_id]);
        return {message: `${insertType} created`, status: 200};
    }
}

async function listCategory(status) {
    let condition = '';
    if(status) {
        condition =  " and status = 1 ";
    }
    const rows = await db.query(`select * from z3_document_categories  where parent_id = 0 ${condition}`);
    const data = helper.emptyOrRows(rows);
    if (data.length) {
        return {message: data, status: 200};
    } else {
        return {message: "Category list is empty", status: 200};
    }
}

async function listSubCategory(status) {
    let condition = '';
    if(status) {
        condition =  " and status = 1 ";
    }
    const rows = await db.query(`select * from z3_document_categories where parent_id <> 0 ${condition}`);
    const data = helper.emptyOrRows(rows);
    if (data.length) {
        return {message: data, status: 200};
    } else {
        return {message: "Sub category list is empty", status: 200};
    }
}

async function listAll(status) {
    let condition = '';
    if(status) {
        condition =  " where status = 1 ";
    }
    const rows = await db.query(`select * from z3_document_categories ${condition}`);
    const data = helper.emptyOrRows(rows);
    if (data.length) {
        return {message: data, status: 200};
    } else {
        return {message: "Category/Sub category list is empty", status: 200};
    }
}

async function updateCategory(catId, category, status, parent_id = 0 ) {
    const insertType = (parent_id === 0) ? "Category" : "Sub category";
    status = (status) ? 1 : 0;
    const rows = await db.query(`select * from z3_document_categories where category_name = ?`, [category]);
    const data = helper.emptyOrRows(rows);
    if (data.length) {
        const catDetails = data[0];
        if (catDetails.category_id.toString() === catId.toString()) {
            const response = await db.query(`UPDATE z3_document_categories set status = ?, parent_id = ? , updated_at = current_timestamp() where category_id = ?`, [status, parent_id, catId]);
            return {message: `${insertType} updated`, status: 200};
        } else {
            return {message: `${insertType} should be unique among catgeory and sub category.`, status: 400};
        }
    } else {
        const response = await db.query(`UPDATE  z3_document_categories set category_name = ? , status = ?, parent_id = ? , updated_at = current_timestamp() where category_id = ?`, [category, status, parent_id, catId]);
        return {message: `${insertType}  updated`, status: 200};
    }
}

async function deleteCategory(catId, parentId) {
    let condition = '';
    let parameters = [catId];
    if(parentId !== 0) {
        condition =  " or parent_id = ? ";
        parameters.push(catId);
    }
    const response = await db.query(`DELETE from z3_document_categories where category_id = ? ${condition}`, parameters);
    return {message: `Category/Subcategory deleted`, status: 200};
}

async function listUserCategory(user_id) {
    const rows = await db.query(`select * from z3_user_categories where user_id = ?`, [user_id]);
    const data = helper.emptyOrRows(rows);
    if (data.length) {
        return {message: data, status: 200};
    } else {
        return {message: "Category permission list is empty", status: 200};
    }
}

module.exports = {
    createCategory, listCategory, listSubCategory, updateCategory, deleteCategory, listAll, listUserCategory
}