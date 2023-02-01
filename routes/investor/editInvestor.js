var express = require('express');
var router = express.Router();
var investorService = require('../../services/investor');
const emailService = require('../../services/email');
const emailTemplate = require('../../email-template/investor/update-profile');

router.get('/', async function (req, res, next) {
    if (!req.session.loggedin) {
        res.redirect('./login');
    }
    req.session.msg = "Investor data not found!!";
    res.redirect('./investor');
});

router.post('/', async function(req, res, next) {

    if(!req.session.loggedin) {
        res.redirect('./login');
    }

    const id = req.body['edit-id'];
    const investorId = req.body.investor_id;
    if(investorId) {
        const company_legal_name = req.body.company_legal_name;
        const financial_year= req.body.financial_year;
        const investor_type = req.body.investor_type;
        const funds = req.body['fund_association[]'];
        const first_name = req.body.contact_name;
        const username = req.body.username;
        const alt_email_1 = req.body.alt_email_1;
        const alt_email_2 = req.body.alt_email_2;
        const phone_number = req.body.contact_number;
        const status = req.body.status ? 1 : 0;
        const hasPassword = req.body.hasPassword;

        let fund_association = '';
        if (funds) {
            fund_association = Array.isArray(funds) ? funds.join(", ") : funds;
        }

        try {
            if(investorId) {
                const response = await investorService.updateInvestor({alt_email_1: alt_email_1, alt_email_2: alt_email_2, user_id: investorId, company_legal_name: company_legal_name, financial_year: financial_year, investor_type: investor_type, fund_association: fund_association, first_name: first_name, username: username, phone_number: phone_number, status: status});
                req.session.msg = response.message;
                const transporter = emailService.getTransporter();
                 const textData = emailTemplate.updateProfile.replace('{first_name}', first_name);
                const subject = 'Z3Partners: Investor data Updated successfully';
                const mailData = emailService.getMailData([username], subject , textData);
                if (status && hasPassword) {
                    transporter.sendMail(mailData, function (err, info) {
                        if (err)
                            console.log(err);
                        else
                            console.log(info);
                    });
                }
                res.redirect('./investor');
            } else {
                const response = await investorService.addInvestor({alt_email_1: alt_email_1, alt_email_2: alt_email_2, company_legal_name: company_legal_name, financial_year: financial_year, investor_type: investor_type, fund_association: fund_association, first_name: first_name, username: username, phone_number: phone_number, status: status});
                req.session.msg = response.message;
                res.redirect('./investor');
            }
        } catch (err) {
            console.error(`Error while getting investor details`, err.message);
            next(err);
        }
    } else {
        const rows = await investorService.getInvestor(+id);
        if(rows.status === 200) {
            res.locals.inventor = JSON.stringify(rows.message[0]);
            res.render(`./investor/edit-investor`, {message: '', catList: '', users:  req.session.users, roles: req.session.roleDetails});
        } else {
            req.session.msg = "Investor data not found!!";
            //res.redirect('./investor');
        }
    }
});

module.exports = router;
