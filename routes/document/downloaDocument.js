var express = require('express');
var router = express.Router();
var documentService = require('../../services/document');
const nodemailer = require('nodemailer');

router.post('/', async function (req, res, next) {

    if (!req.session.loggedin) {
        res.redirect('./login');
    }
    let resposne = {message: "Unable to send document.", status: 500};
    try {
        console.log(req.body);
        const transporter = nodemailer.createTransport({
            port: 465,               // true for 465, false for other ports
            host: "mail.mail.z3partners.com",
            auth: {
                user: 'auth@mail.z3partners.com',
                pass: 'Hte@36$'
                //user: 'support@z3partners.com',
                //pass: 'H@#^sH^6d86z0i28',
            },
            secure: true,
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false
            },
        });

        const mailData = {
            from: 'auth@mail.z3partners.com',  // sender address
            replyTo: 'partner@z3partners.com',  // sender address
            to: 'production2@4thdimension.in',   // list of receivers
            subject: 'This is Z3 Partners',
            text: 'his email is for your email verification.',
            html: ''
        };

        // An array of attachments
        /*        attachments: [
         {
         filename: 'text notes.txt',
         path: 'notes.txt
         },
         ];*/
        transporter.sendMail(mailData, function (err, info) {
            if(err)
                console.log(err);
            else
                console.log(info);
        });
        res.send({message: 'Email sent'});
    } catch (err) {
        console.error(`Error while getting category details`, err.message);
        next(err);
    }
});

module.exports = router;
