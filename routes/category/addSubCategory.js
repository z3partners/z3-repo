var express = require('express');
var router = express.Router();
const categoryService = require('../../services/category');

router.post('/', async function (req, res, next) {

    if(!req.session.loggedin) {
        res.redirect('./login');
    }

    const subCategory = req.body.subCategory;
    const status = req.body.status;
    const catId = req.body.categoryId;
    const subCatId = req.body.subCatId;
    try {

        if(subCatId) {
            const resposne = await categoryService.updateCategory(subCatId, subCategory, status, catId);
            req.session.msg = resposne.message;
            res.redirect('./sub-category');
        } else {
            const resposne = await categoryService.createCategory(subCategory, status, catId);
            req.session.msg = resposne.message;
            res.redirect('./sub-category');
        }
    } catch (err) {
        console.error(`Error while getting sub subCategory details`, err.message);
        next(err);
    }
});

module.exports = router;
