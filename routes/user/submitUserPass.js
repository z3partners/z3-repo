var express = require('express');
var router = express.Router();
var categoryService = require('../../services/category');
var userService = require('../../services/user');
const emailService = require("../../services/email");
const emailTemplate = require('../../email-template/user/changed-password');

/* GET home page. */
router.post('/', async function(req, res, next) {
    if(!req.session.loggedin) {
        res.redirect('./login');
    }
    const password = req.body.password;
    const userId = req.body.user_id;
    const username = req.body.username;
    const first_name = req.body.first_name;
    const status = req.body.status;
    const userType = req.body.userType ? req.body.userType : 'User';

    try {
        if(userId) {
            const resposne = await userService.createUserPass({user_id: userId, password: password}, userType);
            const transporter = emailService.getTransporter();
            req.session.msg = resposne.message;
            const textData = ((emailTemplate.changePassword.replace('{first_name}', first_name)).replace("{created_updated}", 'created')).replace("{{password}}", password);
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
            req.session.msg = "Something went wrong. Please try again";
            res.redirect('./users');
        }
    } catch (err) {
        console.error(`Error while getting sub subCategory details`, err.message);
        next(err);
    }
});

module.exports = router;