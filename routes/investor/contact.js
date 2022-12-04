var express = require('express');
var router = express.Router();
var categoryService = require('../../services/category');
const emailService = require('../../services/email');

/* GET home page. */
router.get('/', async function(req, res, next) {
    if(!req.session.loggedin) {
        res.redirect('./login');
    }

    try {
        res.locals.showFilter =  false;
        res.locals.showCat =  false;
        const resposne = await categoryService.listCategory();
        const resAll = await categoryService.listAll();
        req.session.catList = resposne;
        res.locals.allCategory = JSON.stringify(resAll.message);
        const msg = req.session.msg;
        const catList = req.session.catList ? req.session.catList : [];
        req.session.msg = '';
        res.render(`./investor/contact`, {
            message: msg,
            catList: catList,
            users:  req.session.users,
            roles: req.session.roleDetails
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

    try {
        res.locals.showFilter =  false;
        res.locals.showCat =  false;
        const sub = req.body['contact-subject'];
        const feedbackQuery = req.body['feedback-query'];

        const transporter = emailService.getTransporter();
        const mailData = {
            from: 'auth@mail.z3partners.com',  // sender address
            to: 'production2@4thdimension.in',   // list of receivers
            subject: sub,
            text: feedbackQuery
        };

        transporter.sendMail(mailData, function (err, info) {
            if(err)
                console.log(err);
            else
                console.log(info);
        });

        const resposne = await categoryService.listCategory();
        const resAll = await categoryService.listAll();
        req.session.catList = resposne;
        res.locals.allCategory = JSON.stringify(resAll.message);
        const msg = 'Feedback sent!!';
        const catList = req.session.catList ? req.session.catList : [];
        res.render(`./investor/contact`, {
            message: msg,
            catList: catList,
            users:  req.session.users,
            roles: req.session.roleDetails
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

module.exports = router;
