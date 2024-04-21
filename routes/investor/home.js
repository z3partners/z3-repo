var express = require('express');
var router = express.Router();
var categoryService = require('../../services/category');
var investorService = require('../../services/investor');
var documentService = require('../../services/document');
const admin_roles = [1, 4, 5];

/* GET home page. */
router.get('/', async function(req, res, next) {

    if(!req.session.loggedin) {
        res.redirect('./login');
    } else if(!admin_roles.includes(req.session.roleDetails.role_id)) {
        res.redirect('./inv-home');
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
