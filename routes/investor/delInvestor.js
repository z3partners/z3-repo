var express = require('express');
var router = express.Router();
var investorService = require('../../services/investor');
const emailService = require("../../services/email");

router.post('/', async function (req, res, next) {

    if (!req.session.loggedin) {
        res.redirect('./login');
    }
    let resposne = {message: "Unable to delete investor", status: 500};
    try {
        const investor_id = req.body.investor_id;
        const username = req.body.username;
        if (investor_id) {
            resposne = await investorService.deleteInvestor(investor_id);
            const transporter = emailService.getTransporter();
            const textData = 'Investor deleted successfully!!';
            const subject = 'Z3Partners: investor deleted successfully';
            const mailData = emailService.getMailData(username, subject, textData);
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
        console.error(`Error while deleting investor`, err.message);
        next(err);
    }
});

module.exports = router;
