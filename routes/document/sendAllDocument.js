var express = require('express');
const router = express.Router();
const investorService = require('../../services/investor');
const emailService = require("../../services/email");

router.get('/', async function(req, res, next) {
});

router.post('/', async function (req, res) {
    const allInvestor = await investorService.listAll(true);
    if(Array.isArray(allInvestor.message)) {
        allInvestor.message.forEach(function (investor) {
            const fileData = JSON.parse(req.body.file_path);
            const emailId = investor.username;
            if(+investor.status) {
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
        });
        res.send({message: "Send to all"});
    } else {
        res.send({message: "Unable to send email: Investor list is empty"});
    }

});
module.exports = router;
