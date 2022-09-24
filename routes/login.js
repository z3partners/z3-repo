var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let view = 'login/login';
  if(req.session.loggedin) {
    view = 'index';
  }
  const msg = req.session.msg ;
  res.render(`${view}`, { message: msg });
});

module.exports = router;
