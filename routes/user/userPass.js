var express = require('express');
var router = express.Router();
var categoryService = require('../../services/category');
var userService = require('../../services/user');

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
        res.redirect('./users');
    }

    const resposne = await categoryService.listCategory();
    const user = await userService.getUser(id);
    if(!Array.isArray(user.message)) {
        req.session.msg = 'Something went wrong. Please try again.';
        res.redirect('./users');
    }
    req.session.catList = resposne;
    const msg = req.session.msg;
    const catList = req.session.catList ? req.session.catList : [];
    res.locals.user = JSON.stringify(user.message);
    res.render(`./user/create-user-pass`, {message: msg, catList: catList, users:  req.session.users, roles: req.session.roleDetails});
});

//./create-investor-pass?id=${inv.user_id}
module.exports = router;