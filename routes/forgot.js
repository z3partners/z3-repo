var express = require('express');
var router = express.Router();

/* post login page. */
router.get('/', function(req, res, next) {
    // const username = req.body.username
    console.log(req.body);
    console.log(req.params);
    console.log(req.query);
    // res.send('Form Submit page');
    res.render('login/forgot-password');
});

module.exports = router;