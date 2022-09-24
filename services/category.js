const db = require('./db');
const helper = require('../helper');


async function createCategory(category, status) {
    status = (status) ? 1 : 0;
    const rows = await db.query(`select * from z3_document_categories where category_name = ?`, [category]);
    const data = helper.emptyOrRows(rows);
    if(data.length) {
        return  {message: "Category exist!!", css:"warning", status: 400};
    } else {
        const response = await db.query(`INSERT into z3_document_categories (category_name, status) values (?, ?)`, [category, status]);
        return  {message: `Category created!!`, css:"success", status: 200};
    }
}

async function listCategory() {
    const rows = await db.query(`select * from z3_document_categories`);
    const data = helper.emptyOrRows(rows);
    if(data.length) {
        return  {message: data, css:"success", status: 200};
    } else {
        return  {message: "Category list is empty",css:"success", status: 200};
    }
}

async function updateCategory(catId, category, status) {
    status = (status) ? 1 : 0;
    const rows = await db.query(`select * from z3_document_categories where category_name = ?`, [category]);
    const data = helper.emptyOrRows(rows);
    if(data.length) {
        const catDetails = data[0];
        //console.log("catDetails.id===catId",catDetails.category_id, catId, catDetails.category_id.toString() === catId.toString());
        if(catDetails.category_id.toString() === catId.toString()) {
            const response = await db.query(`UPDATE z3_document_categories set status = ? where category_id = ?`, [status, catId]);
            return  {message: `Category updated!!`, css:"success", status: 200};
        } else {
            return  {message: `Category exist!!`, css:"warning",  status: 400};
        }
    } else {
        const response = await db.query(`UPDATE  z3_document_categories set category_name = ? , status = ? where category_id = ?`, [category, status, catId]);
        return  {message: `Category updated!!`, css:"success", status: 200};
    }
}

module.exports = {
    createCategory, listCategory, updateCategory
}