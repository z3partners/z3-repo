var express = require('express');
var router = express.Router();
var categoryService = require('../../services/category');
var investorService = require('../../services/investor');
const emailService = require("../../services/email");

/* GET home page. */
router.post('/', async function(req, res, next) {
    if(!req.session.loggedin) {
        res.redirect('./login');
    }
    const password = req.body.password;
    const confirmPassword = req.body['confirm-password'];
    const investorId = req.body.investor_id;
    if(confirmPassword !== password){
        req.session.msg = "Password and Confirm Password is not matching.";
        res.redirect(`./create-investor-pass?id=${investorId}`);
    }

    try {
        if(investorId) {
            const resposne = await investorService.createInvestorPass({user_id: investorId, password: password});
            req.session.msg = resposne.message;
            const transporter = emailService.getTransporter();
            const textData = 'Password created successfully!!';
            const mailData = {
                from: 'auth@z3partners.com',  // sender address
                replyTo: 'partner@z3partners.com',  // sender address
                to: 'production2@4thdimension.in',   // list of receivers
                subject: 'Z3 Partners: Password created successfully',
                text: textData
            };
            transporter.sendMail(mailData, function (err, info) {
                if(err)
                    console.log(err);
                else
                    console.log(info);
            });
            res.redirect('./investor');
        } else {
            req.session.msg = "Something went wrong. Please try again!!";
            res.redirect('./investor');
        }
    } catch (err) {
        console.error(`Error while getting sub subCategory details`, err.message);
        next(err);
    }
});

module.exports = router;