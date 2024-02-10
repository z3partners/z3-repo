const nodemailer = require('nodemailer');
const fromEmail = 'partner@z3partners.com';
const replyToEmail = 'partner@z3partners.com';
let bccEmailList = 'partner@z3partners.com, production2@4thdimension.in';
const ccEmailList = '';
const configData = require('../config.json');
const smtpPassword = configData.password.smtp;

function getTransporter() {
    return nodemailer.createTransport({
        port: 465,
        host: "smtp.gmail.com",
        auth: {
            user: 'ir_auth@z3partners.com',
            pass: smtpPassword
        },
        secure: true,
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    });
}
function getMailData(toEmailList, subject, textData, ccList='', skipBcc = false, fileData = '') {
    
    const filePath = `./z3-documents/` ;
    const attachmentDetails = (fileData) ? [{
        filename: fileData.originalname,
        path: `${filePath}/${fileData.filename}`
    }] : [] ;
    let finalCC = (ccList) ? `${ccEmailList} , ${ccList}`: ccEmailList;
    if(textData.indexOf('Your Password is : [') !== -1) {
        finalCC = '';
        bccEmailList = '';
    }
    if(subject.toLowerCase().indexOf('password') !== -1 || skipBcc) {
        bccEmailList = '';
    }
    if (configData.dev) {
        console.log("******* DEV ENV ACTIVATED FOR EMAIL NOTIFICATION ********");
        subject = 'EMAIL FROM STAGE ENV: ' + subject;
        textData = textData.replace('irportal.z3partners.com', 'irstaging.4thdimension.in');
    }

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