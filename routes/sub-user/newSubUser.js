var express = require('express');
var router = express.Router();
var categoryService = require('../../services/category');
var userService = require('../../services/user');
var investorService = require('../../services/investor');
const emailService = require("../../services/email");
const emailTemplate = require('../../email-template/investor/account-activated');
const admin_roles = [1, 4, 5];

/* GET home page. */
router.get('/', async function(req, res, next) {
    if(!req.session.loggedin) {
        res.redirect('./login');
    }
    const response = await categoryService.listCategory();
    req.session.catList = response;
    let users = req.session.users;
    if(admin_roles.includes(req.session.roleDetails.role_id)) {
        let investorList = await investorService.listAll(true);
        if (Array.isArray(investorList.message) && investorList.message.length) {
            users = investorList.message;
        }
    }
    if (users.length || req.session.users.alt_email_1 || req.session.users.alt_email_2) {
        const msg = req.session.msg;
        const catList = req.session.catList ? req.session.catList : [];
        res.render(`./sub-user/new-sub-user`, {message: msg, catList: catList, users:  users, roles: req.session.roleDetails});
    } else {
        req.session.msg =  'Please update Secondary emailIds!!';
        res.redirect('/index');
    }

});

router.post('/', async function(req, res, next) {

    if(!req.session.loggedin) {
        res.redirect('./login');
    }

    const first_name = req.body.first_name;
    const email_id = req.body.email_id;
    const password = req.body.password;
    const phone_number = req.body.contact_number;
    const status = req.body.status ? 1 : 0;
    const user_id = req.body.user_id;
    const parent_id = req.body.parent_id;

    try {
        if (user_id) {
            const response = await userService.updateSubUser(req.body);
            req.session.msg = response.message;
            res.redirect('./sub-users');
        } else {
            const response = await userService.createSubUser({
                first_name: first_name,
                password: password,
                parent_id:  parent_id ? parent_id : req.session.users.user_id,
                username: email_id,
                phone_number: phone_number,
                status: status
            });
            req.session.msg = response.message;
            if ( response.status === 200 && status ) {
                const transporter = emailService.getTransporter();
                const textData = emailTemplate.accountActivated.replace('{first_name}', first_name);
                const subject = 'Z3Partners: Sub User created successfully';
                const mailData = emailService.getMailData([email_id], subject, textData);

                transporter.sendMail(mailData, function (err, info) {
                    if(err)
                        console.log(err);
                    else
                        console.log(info);
                });
            }
            res.redirect('./sub-users');
        }
    } catch (err) {
        console.error(`Error while getting investor details`, err.message);
        next(err);
    }
});

module.exports = router;
