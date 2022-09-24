var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let view = 'login/login';
  if(req.session.loggedin) {
    view = 'index';
  }
  // console.log(req.session);
  res.render(`${view}`, {message: '', users: req.session.users, roles: req.session.roleDetails});
});

module.exports = router;
