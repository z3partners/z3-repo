var express = require('express');
var router = express.Router();
var categoryService = require('../../services/category');
var investorService = require('../../services/investor');

/* GET home page. */
router.get('/', async function(req, res, next) {
    if(!req.session.loggedin) {
        res.redirect('./login');
    }
});

router.post('/', async function(req, res, next) {
    if(!req.session.loggedin) {
        res.redirect('./login');
    }

    const id = req.body['edit-id'];
    if(!id) {
        res.redirect('./investor');
    }

    const resposne = await categoryService.listCategory();
    const investor = await investorService.getInvestor(id);
    if(!Array.isArray(investor.message)) {
        req.session.msg = 'Something went wrong. Please try again!!';
        res.redirect('./investor');
    }
    req.session.catList = resposne;
    const msg = req.session.msg;
    const catList = req.session.catList ? req.session.catList : [];
    res.locals.investor = JSON.stringify(investor.message);
    res.render(`./investor/create-pass`, {message: msg, catList: catList, users:  req.session.users, roles: req.session.roleDetails});
});

//./create-investor-pass?id=${inv.user_id}
module.exports = router;