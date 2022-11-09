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
        //console.log(req.session.users);
        const msg = req.session.msg;
         req.session.msg = '';
        res.render(`./investor/home`, {
            message: msg,
            users:  req.session.users,
            roles: req.session.roleDetails,
        });
    } catch (error) {
        res.sendStatus(500);
    }
});

module.exports = router;
