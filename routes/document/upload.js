var express = require('express');
var router = express.Router();
var categoryService = require('../../services/category');
var investorService = require('../../services/investor');
var documentService = require('../../services/document');

router.get('/', async function(req, res, next) {
    if(!req.session.loggedin) {
        res.redirect('./login');
    }
    try {
        let investorType = '';
        if(req.session.roleDetails.role_id === 4) {
            investorType = 'Domestic';
        } else if(req.session.roleDetails.role_id === 5) {
            investorType = 'International';
        }
        const resposne = await categoryService.listCategory();
        const resAll = await categoryService.listAll();
        const investorList = await investorService.listAll(false, {investor_type: investorType});
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
    res.render(`documents/upload-document`, {message: msg, catList: catList, users: req.session.users, roles: req.session.roleDetails});

});

module.exports = router;
