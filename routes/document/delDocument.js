var express = require('express');
var router = express.Router();
var documentService = require('../../services/document');
const emailService = require("../../services/email");

router.post('/', async function (req, res, next) {

    if (!req.session.loggedin) {
        res.redirect('./login');
    }
    let response = {message: "Unable to delete document", status: 500};
    try {
        const document_id = req.body.document_id;
        if (document_id) {
            response = await documentService.deleteDocument(document_id);
            const transporter = emailService.getTransporter();
            const textData = 'Document deleted successfully!!';
            const subject = 'Z3 Partners: Document deleted successfully';
            const mailData = emailService.getMailData('production2@4thdimension.in', subject, textData);
            transporter.sendMail(mailData, function (err, info) {
                if(err)
                    console.log(err);
                else
                    console.log(info);
            });
            req.session.msg = response.message;
        }
        res.send(response)
    } catch (err) {
        console.error(`Error while getting category details`, err.message);
        next(err);
    }
});

module.exports = router;
