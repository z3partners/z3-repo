var express = require('express');
var router = express.Router();
var documentService = require('../../services/document');
const emailService = require("../../services/email");

router.post('/', async function (req, res, next) {

    if (!req.session.loggedin) {
        res.redirect('./login');
    }
    let resposne = {message: "Unable to delete document", status: 500};
    try {
        const document_id = req.body.document_id;
        if (document_id) {
            resposne = await documentService.deleteDocument(document_id);
            const transporter = emailService.getTransporter();
            const textData = 'Document deleted successfully!!';
            const mailData = {
                from: 'auth@z3partners.com',  // sender address
                replyTo: 'partner@z3partners.com',  // sender address
                to: 'production2@4thdimension.in',   // list of receivers
                subject: 'Z3 Partners: Document deleted successfully',
                text: textData
            };
            transporter.sendMail(mailData, function (err, info) {
                if(err)
                    console.log(err);
                else
                    console.log(info);
            });
            req.session.msg = resposne.message;
        }
        res.send(resposne)
    } catch (err) {
        console.error(`Error while getting category details`, err.message);
        next(err);
    }
});

module.exports = router;
