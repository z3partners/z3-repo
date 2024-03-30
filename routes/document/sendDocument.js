var express = require('express');
var router = express.Router();
var emailService = require('../../services/email');
const documentService = require('../../services/document');
const emailTemplate = require('../../email-template/document/document-received');

router.post('/', async function (req, res, next) {

    if (!req.session.loggedin) {
        res.redirect('./login');
    }
    try {
        // console.log(req.body);
        const fileData = JSON.parse(req.body.file_path);
        const emailId = req.body.investorEmailID;
        const ccList = req.body.investorCCList;
        const invFirstName = req.body.invFirstName;
        const investorStatus = req.body.investorStatus;
        const documentId = req.body.document_id;
        const documentCat = req.body.catName;
        let message = `Failed to sent notification to [${emailId}]. Please check investor details.`;
        if(emailId !== 'All' && +investorStatus) {
            message = `Notification sent successfully to [${emailId}].`
            const transporter = emailService.getTransporter();
            const textData = (emailTemplate.documentReceived.replace("{first_name}", invFirstName)).replace("{document_name}", fileData.originalname);
            const subject = `Z3Partners has uploaded ${documentCat}`;
            // const mailData = emailService.getMailData(emailId, subject, textData, ccList, fileData);
            const mailData = emailService.getMailData(emailId, subject, textData, ccList, true);
            transporter.sendMail(mailData, function (err, info) {
                if (err)
                    console.log(err);
                else {
                    documentService.updateDocumentSendStatus(+documentId);
                    console.log(info);
                    }
            });
        }

        res.send({message: message});
    } catch (err) {
        console.error(`Error while getting category details`, err.message);
        next(err);
    }
});

module.exports = router;
