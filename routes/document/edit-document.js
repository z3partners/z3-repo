var express = require('express');
var router = express.Router();
var categoryService = require('../../services/category');
var investorService = require('../../services/investor');
var documentService = require('../../services/document');

router.get('/', async function(req, res, next) {
    if(!req.session.loggedin) {
        res.redirect('./login');
    }
            req.session.msg = "Document data not found!!";
            res.redirect('./documents');
});

router.post('/', async function(req, res, next) {
    if(!req.session.loggedin) {
        res.redirect('./login');
    }
    try {
        //const id = req.query.id;
        const id = req.body['edit-id'];
        const rows = await documentService.getDocument(+id);
        if(rows.status === 200) {

            const resposne = await categoryService.listCategory();
            const resAll = await categoryService.listAll();
            const investorList = await investorService.listAll(false, {});
            req.session.catList = resposne;
            res.locals.allCategory = JSON.stringify(resAll.message);
            res.locals.investorList = JSON.stringify(investorList.message);

            res.locals.invSearchFields = JSON.stringify({});
            const catList = req.session.catList ? req.session.catList : [];
            req.session.msg = '';
            req.session.catList = resposne;
            res.locals.invDocs = JSON.stringify(rows.message[0]);
            if(rows.message[0].investor_id === -999) {
                res.render(`./documents/edit-general-document`, {message: '', catList: '', users:  req.session.users, roles: req.session.roleDetails});
            } else {
                res.render(`./documents/edit-document`, {message: '', catList: '', users:  req.session.users, roles: req.session.roleDetails});
            }
        } else {
            req.session.msg = "Document data not found!!";
            res.redirect('./documents');
        }

    } catch (err) {
        console.error(`Error while getting category details`, err.message);
        next(err);
    }
});

module.exports = router;
