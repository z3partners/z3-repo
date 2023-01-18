var express = require('express');
var router = express.Router();
const user = require('../../services/user');
const emailService = require('../../services/email');
const categoryService = require('../../services/category');
const emailTemplate = require('../../email-template/user/account-activated');

/* get login page. */
router.get('/', async function(req, res) {

    if(!req.session.loggedin) {
        res.redirect('./login');
    }

    try {
        const resposne = await categoryService.listCategory();
        const resAll = await categoryService.listAll();
        req.session.catList = resposne;
        res.locals.allCategory = JSON.stringify(resAll.message);
        const msg = req.session.msg;
        const catList = req.session.catList ? req.session.catList : [];
        req.session.msg = '';
        res.render(`./user/new-user`, {
            message: msg,
            catList: catList,
            users:  req.session.users,
            roles:  req.session.roleDetails
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.post('/', async function(req, res, next) {

    if(!req.session.loggedin) {
        res.redirect('./login');
    }

    const first_name = req.body.first_name;
    const email_id = req.body.email_id;
    const password = req.body.password;
    const user_role = req.body.user_role;
    const phone_number = req.body.contact_number;
    const status = req.body.status ? 1 : 0;
    const user_id = req.body.user_id;

    try {
        if(user_id) {
            const resposne = await user.updateInvestor(req.body);
            req.session.msg = resposne.message;
            res.redirect('./users');
        } else {
            const resposne = await user.createUser({
                first_name: first_name,
                password: password,
                username: email_id,
                phone_number: phone_number,
                role: user_role,
                status: status});
            req.session.msg = resposne.message;
            if(resposne.status === 200 && status) {
                const transporter = emailService.getTransporter();
                const textData = emailTemplate.accountActivated.replace('{first_name}', first_name);
                const subject = 'Z3Partners: User created successfully';
                const mailData = emailService.getMailData([email_id], subject, textData);

                transporter.sendMail(mailData, function (err, info) {
                    if(err)
                        console.log(err);
                    else
                        console.log(info);
                });
            }
            res.redirect('./users');
        }
    } catch (err) {
        console.error(`Error while creating user`, err.message);
        next(err);
    }
});

module.exports = router;