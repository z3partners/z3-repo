var express = require('express');
var router = express.Router();
var categoryService = require('../services/category');
var investorService = require('../services/investor');
const emailService = require("../services/email");

/* GET home page. */
router.post('/', async function(req, res, next) {

    const password = req.body.password;
    const confirmPassword = req.body['confirm-password'];
    const investorId = req.body.investor_id;
    try {
        if(investorId) {
            const response = await investorService.createInvestorPass({user_id: investorId, password: password});
            if(response.status === 200) {
                const transporter = emailService.getTransporter();
                const textData = 'Password reset successfully!!';
                const mailData = {
                    from: 'auth@z3partners.com',  // sender address
                    replyTo: 'partner@z3partners.com',  // sender address
                    to: 'production2@4thdimension.in',   // list of receivers
                    subject: 'Z3 Partners: Password reset successfully',
                    text: textData
                };
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