var express = require('express');
var router = express.Router();
var categoryService = require('../../services/category');
var investorService = require('../../services/investor');
var documentService = require('../../services/document');
const emailService = require("../../services/email");
const emailTemplate = require('../../email-template/document/document-received');

router.get('/', async function(req, res, next) {
    if(!req.session.loggedin) {
        res.redirect('./login');
    }
    try {
        const resposne = await categoryService.listCategory();
        const resAll = await categoryService.listAll();
        const investorList = await investorService.listAll(false, {});
        req.session.catList = resposne;
        res.locals.allCategory = JSON.stringify(resAll.message);
        res.locals.investorList = JSON.stringify(investorList.message);

        res.locals.invSearchFields = JSON.stringify({});
        const msg = req.session.msg;
        const catList = req.session.catList ? req.session.catList : [];
        req.session.msg = '';
        req.session.catList = resposne;
    } catch (err) {
        console.error(`Error while getting category details`, err.message);
        next(err);
    }
    const msg = req.session.msg ;
    req.session.msg = '';
    const catList = req.session.catList ? req.session.catList : [];
    res.render(`documents/general-document`, {message: msg, catList: catList, users: req.session.users, roles: req.session.roleDetails});

});

router.post('/', async function (req, res) {
    const allInvestor = await investorService.listAll(true);
    if(Array.isArray(allInvestor.message)) {
        allInvestor.message.forEach(function (investor) {
            const fileData = JSON.parse(req.body.file_path);
            const emailId = investor.username;
            if(+investor.status) {
                const transporter = emailService.getTransporter();
                const textData = (emailTemplate.documentReceived.replace("{investor}", emailId)).replace("{document_name}", fileData.originalname);
                const subject = 'Z3Partners has uploaded new document';
                // const mailData = emailService.getMailData(emailId, subject, textData, fileData);
                const mailData = emailService.getMailData(emailId, subject, textData);
                transporter.sendMail(mailData, function (err, info) {
                    if (err)
                        console.log(err);
                    else
                        console.log(info);
                });
            }
        });
        res.send({message: "Send to all"});
    } else {
        res.send({message: "Unable to send email: Investor list is empty"});
    }

});
module.exports = router;
