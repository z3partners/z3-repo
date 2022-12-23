var express = require('express');
var router = express.Router();
var categoryService = require('../../services/category');
var userService = require('../../services/user');
const emailService = require("../../services/email");

/* GET home page. */
router.post('/', async function(req, res, next) {
    if(!req.session.loggedin) {
        res.redirect('./login');
    }
    const password = req.body.password;
    const userId = req.body.user_id;

    try {
        if(userId) {
            const resposne = await userService.createUserPass({user_id: userId, password: password});
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
            res.redirect('./users');
        } else {
            req.session.msg = "Something went wrong. Please try again!!";
            res.redirect('./users');
        }
    } catch (err) {
        console.error(`Error while getting sub subCategory details`, err.message);
        next(err);
    }
});

module.exports = router;