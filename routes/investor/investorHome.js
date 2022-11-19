var express = require('express');
var router = express.Router();
var categoryService = require('../../services/category');
var investorService = require('../../services/investor');
var documentService = require('../../services/document');

/* GET home page. */
router.get('/', async function(req, res, next) {

    if(!req.session.loggedin) {
        res.redirect('./login');
    }

    try {
        let searchParams = {};
        searchParams.investor_id = req.session.users.user_id;
        const resposne = await categoryService.listCategory();
        const resAll = await categoryService.listAll();
        const investorList = await investorService.listAll(false, {});
        const documentList = await documentService.listAll(true, searchParams);
        req.session.catList = resposne;
        res.locals.allCategory = JSON.stringify(resAll.message);
        res.locals.invSearchFields = JSON.stringify({});
        res.locals.documentList = JSON.stringify(documentList.message);
        const msg = req.session.msg;
        const catList = req.session.catList ? req.session.catList : [];
        req.session.msg = '';
        res.render(`./investor/investor-home`, {
            message: msg,
            catList: catList,
            users:  req.session.users,
            roles: req.session.roleDetails,
            investorList: investorList.message,
            documentList: documentList.message,
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
        let searchParams = {};
        //console.log(req.session.users);
        searchParams.investor_id = req.session.users.user_id;
        if(req.body.nav_cat_id) {
            searchParams.category_id = req.body.nav_cat_id;
        }
        //console.log(searchParams);
        const resposne = await categoryService.listCategory();
        const resAll = await categoryService.listAll();
        const investorList = await investorService.listAll(false, {});
        const documentList = await documentService.listAll(true, searchParams);
        req.session.catList = resposne;
        res.locals.allCategory = JSON.stringify(resAll.message);
        res.locals.invSearchFields = JSON.stringify({});
        res.locals.documentList = JSON.stringify(documentList.message);
        const msg = req.session.msg;
        const catList = req.session.catList ? req.session.catList : [];
        //console.log(req.session.roleDetails, req.session.users);
        req.session.msg = '';
        res.render(`./investor/investor-home`, {
            message: msg,
            catList: catList,
            users:  req.session.users,
            roles: req.session.roleDetails,
            investorList: investorList.message,
            documentList: documentList.message,
        });
    } catch (error) {
        res.sendStatus(500);
    }
});

module.exports = router;
