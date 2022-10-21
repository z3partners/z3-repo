var express = require('express');
var router = express.Router();
var categoryService = require('../services/category');

/* GET home page. */
router.get('/', async function(req, res, next) {
  let view = 'login/login';
  if(req.session.loggedin) {
      const resposne = await categoryService.listCategory();
      req.session.catList = resposne;
    view = 'index';
  }
    const catList = req.session.catList ? req.session.catList : [];
  res.render(`${view}`, {message: '', catList: catList, users:  req.session.users, roles: req.session.roleDetails});
});

module.exports = router;
