var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  req.session.destroy(function(err) {
    console.log("Session destroyed.", err);
  })
  res.redirect('/');
});

module.exports = router;
