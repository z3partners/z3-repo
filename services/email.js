const nodemailer = require('nodemailer');

function getTransporter() {
    return nodemailer.createTransport({
        port: 465,               // true for 465, false for other ports
        host: "mail.mail.z3partners.com",
        auth: {
            user: 'auth@mail.z3partners.com',
            pass: 'Hte@36$',
            //user: 'support@z3partners.com',
            //pass: 'H@#^sH^6d86z0i28',
        },
        secure: true,
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    });
}


module.exports = {
    getTransporter
}