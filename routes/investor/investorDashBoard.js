var express = require('express');
var router = express.Router();
var categoryService = require('../../services/category');
var investorService = require('../../services/investor');

/* GET home page. */
router.get('/', async function(req, res, next) {

    if(!req.session.loggedin) {
        res.redirect('./login');
    } else if(req.session.roleDetails.role_id !== 1) {
        res.redirect('./inv-home');
    }
    try {

        const resposne = await categoryService.listCategory();
        const resAll = await categoryService.listAll();
        const investorList = await investorService.listAll(false, {});
        req.session.catList = resposne;
        res.locals.allCategory = JSON.stringify(resAll.message);
        res.locals.invSearchFields = JSON.stringify({});
        const msg = req.session.msg;
        const catList = req.session.catList ? req.session.catList : [];
        req.session.msg = '';
        res.render(`./investor/investor-dashboard`, {
            message: msg,
            catList: catList,
            users:  req.session.users,
            roles: req.session.roleDetails,
            investorList: investorList.message
        });
    } catch (error) {
        res.sendStatus(500);
    }
});

router.post('/', async function(req, res, next) {

    if(!req.session.loggedin) {
        res.redirect('./login');
    }

    try {

        const financial_year= req.body.financial_year;
        const investor_type = req.body.investor_type;
        const funds = req.body.fund_association;

        const resposne = await categoryService.listCategory();
        const resAll = await categoryService.listAll();
        const investorList = await investorService.listAll(false, {financial_year: financial_year, investor_type: investor_type, funds: funds});
        req.session.catList = resposne;
        res.locals.allCategory = JSON.stringify(resAll.message);
        res.locals.invSearchFields = JSON.stringify({financial_year: financial_year, investor_type: investor_type, funds: funds});
        const msg = req.session.msg;
        const catList = req.session.catList ? req.session.catList : [];
        req.session.msg = '';
        res.render(`./investor/investor-dashboard`, {
            message: msg,
            catList: catList,
            users:  req.session.users,
            roles: req.session.roleDetails,
            investorList: investorList.message
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

module.exports = router;
