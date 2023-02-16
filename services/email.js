const nodemailer = require('nodemailer');
const fromEmail = 'partner@z3partners.com';
const replyToEmail = 'partner@z3partners.com';
const bccEmailList = 'partner@z3partners.com, production2@4thdimension.in';
const ccEmailList = '';
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
function getMailData(toEmailList, subject, textData, ccList='', fileData = '') {
    
    const filePath = `./z3-documents/` ;
    const attachmentDetails = (fileData) ? [{
        filename: fileData.originalname,
        path: `${filePath}/${fileData.filename}`
    }] : [] ;
    const finalCC = (ccList) ? `${ccEmailList} , ${ccList}`: ccEmailList;
    return {
         to: Array.isArray(toEmailList) ?  toEmailList.join(", ") : toEmailList,   // list of receivers
         from: fromEmail,  // sender address
         replyTo: replyToEmail,  // reply address
         cc: finalCC,
         bcc: bccEmailList,
         subject: subject,
         html: textData,
         attachments: attachmentDetails
     };
}

module.exports = {
    getTransporter, getMailData
}