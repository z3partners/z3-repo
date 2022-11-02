var express = require('express');
var router = express.Router();
var investorService = require('../../services/investor');

router.post('/', async function (req, res, next) {

    if (!req.session.loggedin) {
        res.redirect('./login');
    }
    let resposne = {message: "Unable to delete investor details", status: 500};
    try {
        const investor_id = req.body.investor_id;
        if (investor_id) {
            resposne = await investorService.deleteInvestor(investor_id);
            req.session.msg = resposne.message;
        }
        res.send(resposne)
    } catch (err) {
        console.error(`Error while getting category details`, err.message);
        next(err);
    }
});

module.exports = router;
