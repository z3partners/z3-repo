var express = require('express');
var router = express.Router();
const categoryService = require('../services/category');

router.post('/', async function (req, res, next) {

    if (!req.session.loggedin) {
        res.redirect('./login');
    }

    try {
        const catId = req.body.catId;
        if (catId) {
            const resposne = await categoryService.deleteCategory(catId);
            req.session.msg = "Deleted";//resposne.message;
        }
        res.redirect('./category');
    } catch (err) {
        console.error(`Error while getting category details`, err.message);
        next(err);
    }
});

module.exports = router;
