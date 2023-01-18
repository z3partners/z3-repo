var express = require('express');
var router = express.Router();
var emailService = require('../../services/email');
const emailTemplate = require('../../email-template/document/document-received');

router.post('/', async function (req, res, next) {

    if (!req.session.loggedin) {
        res.redirect('./login');
    }
    try {
        // console.log(req.body.investorEmailID, req.body);
        const fileData = JSON.parse(req.body.file_path);
        const emailId = req.body.investorEmailID;
        const investorStatus = req.body.investorStatus;
        let message = `Failed to sent document to [${emailId}]. Please check investor details.`;
        if(emailId !== 'All' && +investorStatus) {
            message = `Document sent successfully to [${emailId}].`
            const transporter = emailService.getTransporter();
            const textData = (emailTemplate.documentReceived.replace("{investor}", emailId)).replace("{document_name}", fileData.originalname);
            const subject = 'Z3Partners has uploaded new document';
            // const mailData = emailService.getMailData(emailId, subject, textData, fileData);
            const mailData = emailService.getMailData(emailId, subject, textData);
            transporter.sendMail(mailData, function (err, info) {
                if (err)
                    console.log(err);
                else
                    console.log(info);
            });
        }

        res.send({message: message});
    } catch (err) {
        console.error(`Error while getting category details`, err.message);
        next(err);
    }
});

module.exports = router;
