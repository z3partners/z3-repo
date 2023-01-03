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
    const username = req.body.username;
    const status = req.body.status;

    try {
        if(userId) {
            const resposne = await userService.createUserPass({user_id: userId, password: password});
            const transporter = emailService.getTransporter();
            req.session.msg = resposne.message;
            const textData = `Password created successfully, your password is [${password}]`;
            const subject = 'Z3Partners: Password created successfully';
            const toEmailList = (username) ? [username] : 'production2@4thdimension.in';
            const mailData = emailService.getMailData(toEmailList, subject, textData);
            if(+status) {
                transporter.sendMail(mailData, function (err, info) {
                    if(err)
                        console.log(err);
                    else
                        console.log(info);
                });
            }
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