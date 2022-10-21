var express = require('express');
var router = express.Router();
const categoryService = require('../../services/category');

router.post('/', async function (req, res, next) {

    if(!req.session.loggedin) {
        res.redirect('./login');
    }

    const category = req.body.category;
    const status = req.body.status;
    const catId = req.body.catId;
    try {

        if(catId) {
            const resposne = await categoryService.updateCategory(catId, category, status);
            req.session.msg = resposne.message;
            res.redirect('./category');
        } else {
            const resposne = await categoryService.createCategory(category, status);
            req.session.msg = resposne.message;
            res.redirect('./category');
        }
    } catch (err) {
        console.error(`Error while getting category details`, err.message);
        next(err);
    }
});

module.exports = router;
