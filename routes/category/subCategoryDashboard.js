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
        const subCategory = await categoryService.listSubCategory();
        req.session.subCatList = subCategory;

        const allCategory = await categoryService.listCategory();
        req.session.catList = allCategory;
    } catch (err) {
        console.error(`Error while getting category details`, err.message);
        next(err);
    }
    const msg = req.session.msg ;
    req.session.msg = '';
    const subCatList = req.session.subCatList ? req.session.subCatList : [];
    const catList = req.session.catList ? req.session.catList : [];
    res.render(`documents/sub-category-dashboard`, {message: msg, subCatList: subCatList, catList: catList, users: req.session.users, roles: req.session.roleDetails});

});

module.exports = router;
