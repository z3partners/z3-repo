var express = require('express');
var router = express.Router();
var categoryService = require('../../services/category');
const emailService = require('../../services/email');
const emailTemplate = require('../../email-template/investor/contact-us');

/* GET home page. */
router.get('/', async function(req, res, next) {
    if(!req.session.loggedin) {
        res.redirect('./login');
    }

    try {
        res.locals.showFilter =  false;
        res.locals.showCat =  false;
        const roleId = req.session.roleDetails.role_id;
        // const response = await categoryService.listCategory();
        const resposne = await getCategoryForUserType(roleId, req.session.users.user_id);
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
        const cname = req.body.cname;
        const feedbackQuery = (emailTemplate.contactUs.replace("{investor_cname}", `${cname} [${req.session.username}]`)).replace("{feedback_data}", req.body['feedback-query']);//req.body['feedback-query'];
        const transporter = emailService.getTransporter();
        const mailData = emailService.getMailData('partner@z3partners.com', sub, feedbackQuery);

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
        const msg = 'Notification Sent.';
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
async function getCategoryForUserType(role_id, user_id) {

    if (role_id === 6) {
        return await categoryService.getSubUserCategory(user_id);
    } else {
        return await categoryService.listCategory();
    }
}
module.exports = router;
