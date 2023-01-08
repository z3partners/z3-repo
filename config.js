const configData = require('./config.json');
const dbPassword = configData.password.db;

const config = {
    db: {
        host: "179.61.188.50",
        user: "irpo_z3partners-prod",
        password: dbPassword,
        database: "irpo_z3partners",
    }
};
module.exports = config;