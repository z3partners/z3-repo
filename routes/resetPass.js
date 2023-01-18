var express = require('express');
var router = express.Router();
var categoryService = require('../services/category');
var investorService = require('../services/investor');
const emailService = require("../services/email");
const emailTemplate = require("../email-template/user/changed-password");

/* GET home page. */
router.post('/', async function(req, res, next) {

    const password = req.body.password;
    const confirmPassword = req.body['confirm-password'];
    const username = req.body['username'];
    const investorId = req.body.investor_id;
    try {
        if(investorId) {
            const response = await investorService.createInvestorPass({user_id: investorId, password: password});
            if(response.status === 200) {
                const transporter = emailService.getTransporter();
                const textData = ((emailTemplate.changePassword.replace('{username}', username)).replace("{created_updated}", 'reset')).replace("{{password}}", password);
                const subject = 'Z3Partners: Password reset successfully';
                const mailData = emailService.getMailData(username, subject, textData);
                transporter.sendMail(mailData, function (err, info) {
                    if(err)
                        console.log(err);
                    else
                        console.log(info);
                });
                req.session.msg = "Password reset successfully, try Login now";
            } else {
                req.session.msg = "Something went wrong. Please try again!!";
            }

        } else {
            req.session.msg = "Something went wrong. Please try again!!";
        }
        res.redirect('./login');
    } catch (err) {
        console.error(`Error while resetting password`, err.message);
        next(err);
    }
});

module.exports = router;