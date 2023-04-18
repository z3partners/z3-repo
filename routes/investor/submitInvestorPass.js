var express = require('express');
var router = express.Router();
var categoryService = require('../../services/category');
var investorService = require('../../services/investor');
const emailService = require("../../services/email");
const emailTemplate = require('../../email-template/investor/changed-password');

/* GET home page. */
router.post('/', async function(req, res, next) {
    if(!req.session.loggedin) {
        res.redirect('./login');
    }
    const password = req.body.password;
    const confirmPassword = req.body['confirm-password'];
    const investorId = req.body.investor_id;
    const username = req.body.username;
    const status = req.body.status;
    const first_name = req.body.first_name;
    if(confirmPassword !== password){
        req.session.msg = "Password and Confirm Password is not matching.";
        res.redirect(`./create-investor-pass?id=${investorId}`);
    }

    try {
        if(investorId) {
            const resposne = await investorService.createInvestorPass({user_id: investorId, password: password});
            req.session.msg = resposne.message;
            if(resposne.status === 200 && +status) {
                const transporter = emailService.getTransporter();
                const textData = ((emailTemplate.changePassword.replace('{first_name}', first_name)).replace("{created_updated}", 'created')).replace("{password}", password);
                const subject = 'Z3Partners: Password created successfully';
                const mailData = emailService.getMailData(username, subject, textData);
                transporter.sendMail(mailData, function (err, info) {
                    if(err)
                        console.log(err);
                    else
                        console.log(info);
                });
            }
            res.redirect('./investor');
        } else {
            req.session.msg = "Something went wrong. Please try again";
            res.redirect('./investor');
        }
    } catch (err) {
        console.error(`Error while getting sub subCategory details`, err.message);
        next(err);
    }
});

module.exports = router;