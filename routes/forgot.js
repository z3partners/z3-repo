var express = require('express');
var  router = express.Router();
const users = require('../services/user');
var emailService = require('../services/email');
const emailTemplate = require('../email-template/forgot-password');

/* get login page. */
router.get('/', function(req, res) {
    const msg = req.session.msg ? req.session.msg : '';
    req.session.msg = '';
    res.render('login/forgot-password', { message: msg });
});

router.post('/', async function(req, res, next) {
    const user_email = req.body.email;
    let msg = '';
    if(!user_email) {
        msg = "Please provide email id.";
    } else {
        try {
            const response = await users.getResetToken(user_email);
            console.log(response);
            msg = response.message;
            if (response.status === 200) {
                if (response.token) {
                    const transporter = emailService.getTransporter();
                    const textData =  (emailTemplate.forgotPassword.replace("{reset_link}", `https://irportal.z3partners.com/reset/?token=${response.token}`)).replace("{first_name}", response.first_name);
                    const subject = 'Z3Partners: Password reset link';
                    const mailData = emailService.getMailData(user_email, subject, textData);
                    transporter.sendMail(mailData, function (err, info) {
                        if (err)
                            console.log(err);
                        else
                            console.log(info);
                    });
                } else {
                    msg = 'Error while sending reset link, please try again!!';
                }
            }
        } catch (err) {
            console.error(`Error while sending reset link `, err.message);
            next(err);
        }
    }
    res.render('login/forgot-password', { message: msg });
});

module.exports = router;