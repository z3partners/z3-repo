var express = require('express');
var router = express.Router();
var userService = require('../../services/user');
const emailService = require("../../services/email");
const emailTemplate = require('../../email-template/user/update-user');
var categoryService = require('../../services/category');

router.get('/', async function (req, res, next) {
    if (!req.session.loggedin) {
        res.redirect('./login');
    }
    req.session.msg = "User data not found";
    res.redirect('./sub-users');
});

router.post('/', async function(req, res, next) {

    if(!req.session.loggedin) {
        res.redirect('./login');
    }

    const catRes = await categoryService.listCategory();
    req.session.catList = catRes;
    const catList = req.session.catList ? req.session.catList : [];

    const id = req.body['edit-id'];
    const userId = req.body.user_id;
    if(userId) {
        const first_name = req.body.first_name;
        const username = req.body.username;
        const phone_number = req.body.contact_number;
        const status = req.body.status ? 1 : 0;
        const categoryIds = req.body['cat-permission[]'];

        try {
            const resposne = await userService.updateSubUser({
                user_id: userId,
                first_name: first_name,
                phone_number: phone_number,
                status: status,
                categoryIds: categoryIds
            });
            req.session.msg = resposne.message;
            if (resposne.status === 200 && status) {
                const transporter = emailService.getTransporter();
                const textData = (emailTemplate.updateUser.replace("{login_user}", req.session.users.fName)).replace("{user_profile_name}", first_name);
                const subject = 'Z3Partners: Sub User updated successfully';
                const mailData = emailService.getMailData([username], subject, textData);

                transporter.sendMail(mailData, function (err, info) {
                    if (err)
                        console.log(err);
                    else
                        console.log(info);
                });
            }
            res.redirect('./sub-users');
        } catch (err) {
            console.error(`Error while getting user details`, err.message);
            next(err);
        }
    } else {
        const rows = await userService.getUser(+id);
        if(rows.status === 200) {
            res.locals.user = JSON.stringify(rows.message[0]);
            res.render(`./sub-user/edit-sub-user`, {message: '', catList: catList, users:  req.session.users, roles: req.session.roleDetails});
        } else {
            req.session.msg = "User data not found";
            res.redirect('./sub-users');
        }
    }
});

module.exports = router;
