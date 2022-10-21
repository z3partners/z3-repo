var express = require('express');
var router = express.Router();
var categoryService = require('../../services/category');
var investorService = require('../../services/investor');

/* GET home page. */
router.post('/', async function(req, res, next) {
    if(!req.session.loggedin) {
        res.redirect('./login');
    }
    const password = req.body.password;
    const confirmPassword = req.body['confirm-password'];
    const investorId = req.body.investor_id;
    if(confirmPassword !== password){
        req.session.msg = "Password and Confirm Password is not matching.";
        res.redirect(`./create-investor-pass?id=${investorId}`);
    }

    try {
        if(investorId) {
            const resposne = await investorService.createInvestorPass({user_id: investorId, password: password});
            req.session.msg = resposne.message;
            res.redirect('./investor');
        } else {
            req.session.msg = "Something went wrong. Please try again!!";
            res.redirect('./investor');
        }
    } catch (err) {
        console.error(`Error while getting sub subCategory details`, err.message);
        next(err);
    }
});

module.exports = router;