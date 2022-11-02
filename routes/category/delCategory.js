var express = require('express');
var router = express.Router();
const categoryService = require('../../services/category');

router.post('/', async function (req, res, next) {

    if (!req.session.loggedin) {
        res.redirect('./login');
    }
    let resposne = {message: "Unable to delete category/subcategory", status: 500};
    try {
        const catId = req.body.catId;
        let parent_id = (+req.body.parent_id === 0) ? catId : 0;
        if (catId) {
            resposne = await categoryService.deleteCategory(catId, parent_id);
            req.session.msg = resposne.message;
        }
        res.send(resposne)
    } catch (err) {
        console.error(`Error while getting category details`, err.message);
        next(err);
    }
});

module.exports = router;
