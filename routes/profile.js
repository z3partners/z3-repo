var express = require('express');
var router = express.Router();
var investorService = require('../services/investor');
const categoryService = require('../services/category');
const emailService = require("../services/email");

router.get('/', async function (req, res, next) {
    if (!req.session.loggedin) {
        res.redirect('./login');
    }
    req.session.msg = "User data not found!!";
    res.redirect('./');
});

router.post('/', async function(req, res, next) {

    if(!req.session.loggedin) {
        res.redirect('./login');
    }

    const id = req.body['edit-id'];
    const roleId = req.body['role_id'];
    const profileId = req.body['profile_id'];
    const catList = req.session.catList ? req.session.catList : [];
    if(profileId) {
        const first_name = req.body.contact_name;
        const phone_number = req.body.contact_number;
        const alt_email_1 = req.body.alt_email_1;
        const alt_email_2 = req.body.alt_email_2;
        const rows = await investorService.updateProfile({user_id: profileId, first_name: first_name, phone_number: phone_number, alt_email_1: alt_email_1, alt_email_2: alt_email_2});
        const transporter = emailService.getTransporter();
        const textData = 'User profile updated successfully!!';
        const mailData = {
            from: 'auth@z3partners.com',  // sender address
            replyTo: 'partner@z3partners.com',  // sender address
            to: 'production2@4thdimension.in',   // list of receivers
            subject: 'Z3 Partners: User profile updated successfully',
            text: textData
        };
        transporter.sendMail(mailData, function (err, info) {
            if(err)
                console.log(err);
            else
                console.log(info);
        });
        const profileData = await investorService.getInvestor(+profileId);
        res.locals.profile = JSON.stringify(profileData.message[0]);
        req.session.users = {"user_id": profileData.message[0].user_id, "fName": profileData.message[0].first_name, "lName":profileData.message[0].last_name, 'cname': profileData.message[0].company_legal_name};
        res.render(`./profile`, {message: rows.message, catList: catList, users:  req.session.users, roles: req.session.roleDetails});
    } else {
        const rows = await investorService.getInvestor(+id, roleId);
        if(rows.status === 200) {
            res.locals.profile = JSON.stringify(rows.message[0]);
            res.render(`./profile`, {message: '', catList: catList, users:  req.session.users, roles: req.session.roleDetails});
        } else {
            req.session.msg = "User data not found!!";
            res.redirect('./');
        }
    }
});

module.exports = router;
