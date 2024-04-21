var express = require('express');
var router = express.Router();
var categoryService = require('../../services/category');

const admin_roles = [1, 4, 5];

router.get('/', async function(req, res, next) {

    if(!req.session.loggedin) {
        res.redirect('./login');
    } else if(!admin_roles.includes(req.session.roleDetails.role_id)) {
        res.redirect('./inv-home');
    }
    try {
        const resposne = await categoryService.listCategory();
        req.session.catList = resposne;
    } catch (err) {
        console.error(`Error while getting category details`, err.message);
        next(err);
    }
    const msg = req.session.msg ;
    req.session.msg = '';
    const catList = req.session.catList ? req.session.catList : [];
    res.render(`documents/category-dashboard`, {message: msg, catList: catList, users: req.session.users, roles: req.session.roleDetails});

});

module.exports = router;
