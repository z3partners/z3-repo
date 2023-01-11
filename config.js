const configData = require('./config.json');
const dbPassword = configData.password.db;
const config = {
    db: {
        host: "localhost",
        user: "emofmimy",
        password: dbPassword,
        database: "irpo_z3partners"
    }
};

module.exports = config;