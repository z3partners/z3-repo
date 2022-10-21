var express = require('express');
var router = express.Router();
var categoryService = require('../../services/category');
var investorService = require('../../services/investor');

/* GET home page. */
router.get('/', async function(req, res, next) {
    if(!req.session.loggedin) {
        res.redirect('./login');
    }

    const resposne = await categoryService.listCategory();
    req.session.catList = resposne;
    const msg = req.session.msg;
    const catList = req.session.catList ? req.session.catList : [];
    res.render(`./investor/add-investor`, {message: msg, catList: catList, users:  req.session.users, roles: req.session.roleDetails});
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
    const email_id = req.body.email_id;
    const phone_number = req.body.contact_number;
    const status = req.body.status ? 1 : 0;
    const user_id = req.body.user_id;
    let fund_association = '';
    if (funds) {
        fund_association = Array.isArray(funds) ? funds.join(", ") : funds;
    }

    try {
        if(user_id) {
            const resposne = await investorService.updateInvestor(req.body);
            req.session.msg = resposne.message;
            res.redirect('./investor');
        } else {
            const resposne = await investorService.addInvestor({
                company_legal_name: company_legal_name,
                financial_year: financial_year,
                investor_type: investor_type,
                fund_association: fund_association,
                first_name: first_name,
                email_id: email_id,
                phone_number: phone_number,
                status: status});
            req.session.msg = resposne.message;
            res.redirect('./investor');
        }
    } catch (err) {
        console.error(`Error while getting sub subCategory details`, err.message);
        next(err);
    }
});

module.exports = router;
