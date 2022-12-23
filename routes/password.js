var express = require('express');
var router = express.Router();
const users = require('../services/user');
const categoryService = require('../services/category');
const investorService = require('../services/investor');
const emailService = require("../services/email");

/* GET home page. */
router.post('/', async function (req, res, next) {
    if (!req.session.loggedin) {
        res.redirect('./login');
    }

    const id = req.body['edit-id'];
    const userId = req.session.users.user_id;
    const catList = req.session.catList ? req.session.catList : [];
    if (id) {
        const investor = await investorService.getInvestor(id, req.session.roleDetails.role_id);
        res.locals.investor = JSON.stringify(investor.message);
        if (!Array.isArray(investor.message)) {
            req.session.msg = 'Something went wrong. Please try again!!';
            res.render(`./login/change-pass`, {
                message: req.session.msg,
                catList: catList,
                users: req.session.users,
                roles: req.session.roleDetails
            });
        } else {
            res.locals.investor = JSON.stringify(investor.message);
            res.render(`./login/change-pass`, {
                message: req.session.msg,
                catList: catList,
                users: req.session.users,
                roles: req.session.roleDetails
            });
        }
    } else {
        const password = req.body.password;
        const newPassword = req.body.new_password;
        const confirmPassword = req.body['confirm-password'];
        const passRes = await users.changePassword(userId, password, newPassword);
        if (passRes.status === 200) {
            req.session.destroy(function (err) {
                console.log("Session destroyed.", err);
            });
            const transporter = emailService.getTransporter();
            const textData = 'Password changed successfully!!';
            const mailData = {
                from: 'auth@z3partners.com',  // sender address
                replyTo: 'partner@z3partners.com',  // sender address
                to: 'production2@4thdimension.in',   // list of receivers
                subject: 'Z3 Partners: Password changed successfully',
                text: textData
            };
            transporter.sendMail(mailData, function (err, info) {
                if(err)
                    console.log(err);
                else
                    console.log(info);
            });
            res.render('login/login', { message: 'Password updated, please re-login!!!' });
        } else {
            const investor = await investorService.getInvestor(userId);
            res.locals.investor = JSON.stringify(investor.message);
            req.session.msg = passRes.message;
            res.render(`./login/change-pass`, {
                message: req.session.msg,
                catList: catList,
                users: req.session.users,
                roles: req.session.roleDetails
            });
        }
    }
});

module.exports = router;