var express = require('express');
var router = express.Router();
var categoryService = require('../../services/category');
var investorService = require('../../services/investor');
const emailService = require("../../services/email");
const emailTemplate = require('../../email-template/investor/account-activated');

/* GET home page. */
router.get('/', async function(req, res, next) {
    if(!req.session.loggedin) {
        res.redirect('./login');
    }
    const response = await categoryService.listCategory();
    req.session.catList = response;

    if (req.session.users.alt_email_1 || req.session.users.alt_email_2) {
        const msg = req.session.msg;
        const catList = req.session.catList ? req.session.catList : [];
        res.render(`./sub-user/new-sub-user`, {message: msg, catList: catList, users:  req.session.users, roles: req.session.roleDetails});
    } else {
        req.session.msg =  'Please update Secondary emailIds!!';
        res.redirect('/investor');
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

    try {
        if (user_id) {
            const response = await investorService.updateSubUser(req.body);
            req.session.msg = response.message;
            res.redirect('./sub-users');
        } else {
            const response = await investorService.createSubUser({
                first_name: first_name,
                password: password,
                parent_id: req.session.users.user_id,
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
