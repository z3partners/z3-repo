var express = require('express');
var router = express.Router();
var investorService = require('../../services/investor');

/* GET home page. */
router.get('/', async function(req, res, next) {
    if(!req.session.loggedin) {
        res.redirect('./login');
    }
    const id = req.query.id;
    const rows = await investorService.getInvestor(+id);
    if(rows.status === 200) {
        res.locals.inventor = JSON.stringify(rows.message[0]);
        res.render(`./investor/edit-investor`, {message: '', catList: '', users:  req.session.users, roles: req.session.roleDetails});
    } else {
        req.session.msg = "Investor data not found!!";
        res.redirect('./investor');
    }
});

router.post('/', async function(req, res, next) {

    if(!req.session.loggedin) {
        res.redirect('./login');
    }

    const company_legal_name = req.body.company_legal_name;
    const financial_year= req.body.financial_year;
    const investor_type = req.body.investor_type;
    const funds = req.body['fund_association[]'];
    const first_name = req.body.contact_name;
    const username = req.body.username;
    const phone_number = req.body.contact_number;
    const status = req.body.status ? 1 : 0;
    const investorId = req.body.investor_id;
    let fund_association = '';
    if (funds) {
        fund_association = Array.isArray(funds) ? funds.join(", ") : funds;
    }

    try {
        if(investorId) {
            const resposne = await investorService.updateInvestor({user_id: investorId, company_legal_name: company_legal_name, financial_year: financial_year, investor_type: investor_type, fund_association: fund_association, first_name: first_name, username: username, phone_number: phone_number, status: status});
            req.session.msg = resposne.message;
            res.redirect('./investor');
        } else {
            const resposne = await investorService.addInvestor({company_legal_name: company_legal_name, financial_year: financial_year, investor_type: investor_type, fund_association: fund_association, first_name: first_name, username: username, phone_number: phone_number, status: status});
            req.session.msg = resposne.message;
            res.redirect('./investor');
        }
    } catch (err) {
        console.error(`Error while getting sub subCategory details`, err.message);
        next(err);
    }
});

module.exports = router;
