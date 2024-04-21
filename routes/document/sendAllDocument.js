var express = require('express');
var router = express.Router();
var categoryService = require('../../services/category');
var investorService = require('../../services/investor');
var documentService = require('../../services/document');
const emailService = require("../../services/email");
const emailTemplate = require('../../email-template/document/document-received');
const admin_roles = [1, 4, 5];

router.get('/', async function(req, res, next) {
    if(!req.session.loggedin) {
        res.redirect('./login');
    } else if(!admin_roles.includes(req.session.roleDetails.role_id)) {
        res.redirect('./inv-home');
    }
    try {
        const resposne = await categoryService.listCategory();
        const resAll = await categoryService.listAll(1);
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
    let send_to = req.body.send_to;
    if (send_to === "All") {
        send_to = '';
    }
    const allInvestor = await investorService.listAll(true, {investor_type: send_to});
    // console.log(allInvestor.message);
    if(Array.isArray(allInvestor.message)) { 
        const documentId = req.body.document_id;
        await documentService.updateDocumentSendStatus(+documentId);
        allInvestor.message.forEach(function (investor) {
            let ccList = [];
            const fileData = JSON.parse(req.body.file_path);
            const emailId = investor.username;
            const first_name = investor.first_name;
            if(investor.alt_email_1) {
                ccList.push(investor.alt_email_1);
            }
            if(investor.alt_email_2) {
                ccList.push(investor.alt_email_2);
            }
            if(+investor.status) {
                const transporter = emailService.getTransporter();
                const textData = (emailTemplate.documentReceived.replace("{first_name}", first_name)).replace("{document_name}", fileData.originalname);
                const subject = 'Z3Partners has uploaded new document';
                // const mailData = emailService.getMailData(emailId, subject, textData, ccList.join(", "), fileData);
                const mailData = emailService.getMailData(emailId, subject, textData, ccList.join(", "), true);
                transporter.sendMail(mailData, function (err, info) {
                    if (err)
                        console.log(err);
                    else
                        console.log(info);
                });
            }
        });
        res.send({message: "Sent to all"});
    } else {
        res.send({message: "Unable to send email: Investor list is empty"});
    }

});
module.exports = router;
