var express = require('express');
var router = express.Router();
const users = require('../services/user');
var emailService = require('../services/email');

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
            if(response.token) {
                msg = response.message;
                const transporter = emailService.getTransporter();
                const textData = 'Please click the link to reset password: https://irportal.z3partners.com/reset/?token='+ response.token;
                const mailData = {
                    from: 'auth@mail.z3partners.com',  // sender address
                    to: 'production2@4thdimension.in',   // list of receivers
                    subject: 'Z3 Partners: Password reset link',
                    text: textData
                };

                transporter.sendMail(mailData, function (err, info) {
                    if(err)
                        console.log(err);
                    else
                        console.log(info);
                });
            } else {
                msg = 'Error while sending reset link, please try again!!';
            }

        } catch (err) {
            console.error(`Error while sending reset link `, err.message);
            next(err);
        }
    }
    res.render('login/forgot-password', { message: msg });
});

module.exports = router;