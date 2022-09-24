const mysql = require('mysql2/promise');
const config = require('../config');

async function query(sql, params) {
    const connection = await mysql.createConnection(config.db);
    const [results] = await connection.execute(sql, params);

    return results;
}

const escape = mysql.escape;

module.exports = {
    query,
    escape
}


//var connection = mysql.createConnection(config.db);
//
//connection.connect(function(err) {
//    if (err) {
//        console.error('error connecting: ' + err.stack);
//        return;
//    }
//
//    console.log('connected as id ' + connection.threadId);
//});