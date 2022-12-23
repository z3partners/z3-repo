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
        if (investor_id) {
            resposne = await investorService.deleteInvestor(investor_id);
            const transporter = emailService.getTransporter();
            const textData = 'Investor deleted successfully!!';
            const mailData = {
                from: 'auth@z3partners.com',  // sender address
                replyTo: 'partner@z3partners.com',  // sender address
                to: 'production2@4thdimension.in',   // list of receivers
                subject: 'Z3 Partners: Investor deleted successfully',
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
        console.error(`Error while deleting investor`, err.message);
        next(err);
    }
});

module.exports = router;
