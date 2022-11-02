var express = require('express');
var router = express.Router();
var categoryService = require('../../services/category');
var investorService = require('../../services/investor');

/* GET home page. */
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
        res.locals.invSearchFields = JSON.stringify({});
        const msg = req.session.msg;
        const catList = req.session.catList ? req.session.catList : [];
        //console.log(req.session.roleDetails, req.session.users);
        req.session.msg = '';
        res.render(`./investor/investor-home`, {
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

module.exports = router;
