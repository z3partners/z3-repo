const db = require('./db');
const helper = require('../helper');


async function createDocument(documentDetails) {
    const rows = await db.query(`select * from z3_documents where document_name = ?`, [documentDetails.document_name]);
    const data = helper.emptyOrRows(rows);
    if (data.length) {
        return {message: `Document Name should be unique`, status: 400};
    } else {

    const response = await db.query(`
        INSERT INTO z3_documents (document_name, investor_id, financial_year, quarter, category_id, sub_category_id, fund_association,file_path, status) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [documentDetails.document_name,
        documentDetails.investor_id,
        documentDetails.financial_year,
        documentDetails.quarter,
        documentDetails.category_id,
        documentDetails.sub_category_id,
        documentDetails.fund_association,
        documentDetails.file_path,
        documentDetails.status]);

        return {message: `Document created!!`, status: 200, docs : response};
    }
}

async function updateDocument(documentDetails) {
    const rows = await db.query(`select * from z3_documents where document_name = ?`, [documentDetails.document_name]);
    let filePathField = '';
    let dataArr = [documentDetails.document_name,
        documentDetails.investor_id,
        documentDetails.financial_year,
        documentDetails.quarter,
        documentDetails.category_id,
        documentDetails.sub_category_id,
        documentDetails.fund_association,
        documentDetails.status
    ];
    if(documentDetails.file_path) {
        filePathField = ', file_path = ?';
        dataArr.push(documentDetails.file_path);
    }
    const data = helper.emptyOrRows(rows);
    if (data.length) {
        const docDetails = data[0];
        if (docDetails.document_id.toString() === documentDetails.document_id.toString()) {
            const response = await db.query(`
        UPDATE  z3_documents
            set document_name = ?, investor_id = ?, financial_year = ?, quarter = ?, category_id = ?, sub_category_id = ?,
                fund_association = ?, status = ?, updated_at = current_timestamp() ${filePathField} where document_id = ${documentDetails.document_id}`,
            dataArr);
            return {message: `Document updated!!`, status: 200, docs : response};
        } else {
            return {message: `Document Name should be unique`, status: 400};
        }
    } else {
    const response = await db.query(`
        UPDATE  z3_documents
    set document_name = ?, investor_id = ?, financial_year = ?, quarter = ?, category_id = ?, sub_category_id = ?,
        fund_association = ?, status = ?, updated_at = current_timestamp() ${filePathField} where document_id = ${documentDetails.document_id}`,
    dataArr);
    return {message: `Document updated!!`, status: 200, docs : response};
    }
}

async function listAll(status, searchFields) {
    let condition = [];
    let conStr = '';
    if(status) {
        condition.push('status = 1');
    }
    if(searchFields.date_range) {
        condition.push(`created_at  ${searchFields.date_range} `);
    }
    if(searchFields.quarter) {
        condition.push(`quarter = '${searchFields.quarter}'`);
    }
    if(searchFields.category_id) {
        condition.push(`category_id = '${searchFields.category_id}'`);
    }
    if(searchFields.sub_category_id) {
        condition.push(`sub_category_id = '${searchFields.sub_category_id}'`);
    }
    if(searchFields.investor_id) {
        condition.push(`investor_id = '${searchFields.investor_id}'`);
    }

    if(condition.length) {
        conStr  =  " where " + condition.join(" and ");
    }
    //console.log(conStr, searchFields);
    const rows = await db.query(`select * from z3_documents ${conStr}`);
    const data = helper.emptyOrRows(rows);
    if (data.length) {
        return {message: data, status: 200};
    } else {
        return {message: "Document list is empty", status: 200};
    }
}
async function getMaxId() {
    const rows = await db.query(`SELECT MAX(document_id) as maxId FROM z3_documents`);
    const data = helper.emptyOrRows(rows);
    return data[0].maxId ? data[0].maxId + 1 : 1;
}

async function getDocument(id) {
    const rows = await db.query(`select * from z3_documents where document_id = ?`, [id]);
    const res = helper.emptyOrRows(rows);
    if (!res.length) {
        return {message: `Document not found`, status: 404};
    } else {
        return {message: res, status: 200};
    }
}
async function deleteDocument(document_id) {
    const response = await db.query(`DELETE from z3_documents where document_id = ?`, [document_id]);
    return {message: `Document deleted!!`, status: 200};
}


module.exports = {
    createDocument, getMaxId, listAll, getDocument, updateDocument, deleteDocument
}