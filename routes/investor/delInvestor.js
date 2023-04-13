var express = require('express');
var router = express.Router();
var investorService = require('../../services/investor');
const emailService = require("../../services/email");
const emailTemplate = require("../../email-template/investor/delete-account");

router.post('/', async function (req, res, next) {

    if (!req.session.loggedin) {
        res.redirect('./login');
    }
    let response = {message: "Unable to delete investor", status: 500};
    try {
        const investor_id = req.body.investor_id;
        const username = req.body.username;
        const company_legal_name = req.body.company_legal_name;
        if (investor_id) {
            response = await investorService.deleteInvestor(investor_id);
            const transporter = emailService.getTransporter();
            const textData = emailTemplate.deleteAccount.replace("{company_legal_name}", company_legal_name);
            const subject = 'Z3Partners: Investor deleted successfully';
            const mailData = emailService.getMailData('partner@z3partners.com', subject, textData);
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
        console.error(`Error while deleting investor`, err.message);
        next(err);
    }
});

module.exports = router;
