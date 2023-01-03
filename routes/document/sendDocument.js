var express = require('express');
var router = express.Router();
var emailService = require('../../services/email');

router.post('/', async function (req, res, next) {

    if (!req.session.loggedin) {
        res.redirect('./login');
    }
    try {
        // console.log(req.body.investorEmailID, req.body);
        const fileData = JSON.parse(req.body.file_path);
        const emailId = req.body.investorEmailID;
        if(emailId !== 'All') {
            const transporter = emailService.getTransporter();
            const textData = 'Please find attached document sent by Z3Partners';
            const subject = 'Z3Partners: Please find attachment';
            const mailData = emailService.getMailData(emailId, subject, textData, fileData);
            transporter.sendMail(mailData, function (err, info) {
                if (err)
                    console.log(err);
                else
                    console.log(info);
            });
        }

        res.send({message: 'Email sent!!'});
    } catch (err) {
        console.error(`Error while getting category details`, err.message);
        next(err);
    }
});

module.exports = router;
