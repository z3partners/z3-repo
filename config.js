const configData = require('./config.json');
const dbPassword = configData.password.db;
const config = {
    db: {
        host: "localhost",
        user: "emofmimy_z3partners-prod",
        password: dbPassword,
        database: "emofmimy_z3partners_prod"
    }
};


module.exports = config;