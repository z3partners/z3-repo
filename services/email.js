const nodemailer = require('nodemailer');
const fromEmail = 'partner@z3partners.com';
const replyToEmail = 'partner@z3partners.com';
const ccEmailList = 'production2@4thdimension.in';
const configData = require('../config.json');
const smtpPassword = configData.password.smtp;

function getTransporter() {
    return nodemailer.createTransport({
        port: 465,
        host: "smtp.gmail.com",
        auth: {
            user: 'prayas@z3partners.com',
            pass: smtpPassword
        },
        secure: true,
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    });
}
function getMailData(toEmailList, subject, textData, fileData = '') {
    
    const filePath = (process.env.NODE_ENV === 'production')
        ? `/home/irportal.z3partners.com/z3-documents/`
        : `./z3-documents/` ;
    const attachmentDetails = (fileData) ? [{
        filename: fileData.originalname,
        path: `${filePath}/${fileData.filename}`
    }] : [] ;
     return {
         to: Array.isArray(toEmailList) ?  toEmailList.join(", ") : toEmailList,   // list of receivers
         from: fromEmail,  // sender address
         replyTo: replyToEmail,  // reply address
         cc: ccEmailList,
         subject: subject,
         html: textData,
         attachments: attachmentDetails
     };
}

module.exports = {
    getTransporter, getMailData
}