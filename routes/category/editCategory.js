var express = require('express');
var router = express.Router();
const categoryService = require('../../services/category');

router.get('/', async function (req, res, next) {

    if(!req.session.loggedin) {
        res.redirect('./login');
    }

    const category = req.body.id;

    try {
        const resposne = await categoryService.createCategory(category, status);
        req.session.msg = resposne.message;
        res.redirect('./category');
    } catch (err) {
        console.error(`Error while getting category details`, err.message);
        next(err);
    }
});

module.exports = router;
