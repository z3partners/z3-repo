var express = require('express');
var router = express.Router();
var categoryService = require('../../services/category');
var userService = require('../../services/user');

/* GET home page. */
router.post('/', async function(req, res, next) {
    if(!req.session.loggedin) {
        res.redirect('./login');
    }
    const password = req.body.password;
    const userId = req.body.user_id;

    try {
        if(userId) {
            const resposne = await userService.createUserPass({user_id: userId, password: password});
            req.session.msg = resposne.message;
            res.redirect('./users');
        } else {
            req.session.msg = "Something went wrong. Please try again!!";
            res.redirect('./users');
        }
    } catch (err) {
        console.error(`Error while getting sub subCategory details`, err.message);
        next(err);
    }
});

module.exports = router;