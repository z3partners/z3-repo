var express = require('express');
var router = express.Router();
const user = require('../services/user');
var emailService = require('../services/email');

/* get login page. */
router.get('/', async function(req, res) {
    const token = req.query.token;
    const response = await user.getUserDetailByToken(token);
    if(response.status === 200) {
        const userDetails = response.userDetails;
        if(Date.now() > userDetails.reset_token_expiry) {
            req.session.msg = "Token expired please reset again.";
            res.redirect('/forgot-password');
        } else {
            res.render('login/reset-pass', { message: "", investor:  userDetails});
        }
    } else {
        req.session.msg = response.message;
        res.redirect('/forgot-password');
    }

});

module.exports = router;