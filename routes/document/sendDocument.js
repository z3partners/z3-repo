var express = require('express');
var router = express.Router();
var documentService = require('../../services/document');
var emailService = require('../../services/email');

router.post('/', async function (req, res, next) {

    if (!req.session.loggedin) {
        res.redirect('./login');
    }
    let resposne = {message: "Unable to send document", status: 500};
    try {
        //console.log(req.body);
        const fileData = JSON.parse(req.body.file_path);
        const transporter = emailService.getTransporter();

        const mailData = {
            from: 'auth@mail.z3partners.com',  // sender address
            to: 'production2@4thdimension.in',   // list of receivers
            subject: 'Z3 Partners: Please find attachment',
            text: 'This email is for your email verification.',
            attachments: [
                {
                    filename: fileData.originalname,
                    path: `./z3-documents/${fileData.filename}`
                }
            ]
        };

    transporter.sendMail(mailData, function (err, info) {
        if(err)
            console.log(err);
        else
            console.log(info);
    });
        res.send({message: 'Email sent!!'});
    } catch (err) {
        console.error(`Error while getting category details`, err.message);
        next(err);
    }
});

module.exports = router;
