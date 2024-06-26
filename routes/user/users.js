var express = require('express');
var router = express.Router();
var categoryService = require('../../services/category');
var userService = require('../../services/user');
const admin_roles = [1, 4, 5];


/* GET home page. */
router.get('/', async function(req, res, next) {

  if(!req.session.loggedin) {
    res.redirect('./login');
  } else if(!admin_roles.includes(req.session.roleDetails.role_id)) {
    res.redirect('./inv-home');
  }
  try {
    let investorType = '';
    let parent_id_criteria = ' parent_id = 0 ';
    const resposne = await categoryService.listCategory();
    const resAll = await categoryService.listAll();
    const userList = await userService.listAll(false, {investor_type: investorType, parent_id_criteria: parent_id_criteria});
    req.session.catList = resposne;
    res.locals.allCategory = JSON.stringify(resAll.message);
    res.locals.invSearchFields = JSON.stringify({});
    const msg = req.session.msg;
    const catList = req.session.catList ? req.session.catList : [];
    req.session.msg = '';
    res.render(`./user/user-dashboard`, {
      message: msg,
      catList: catList,
      users:  req.session.users,
      roles: req.session.roleDetails,
      userList: userList.message
    });
  } catch (error) {
    res.sendStatus(500);
  }
});

router.post('/', async function(req, res, next) {

  if(!req.session.loggedin) {
    res.redirect('./login');
  }

  try {
    const financial_year= req.body.financial_year;
    const investor_type = req.body.investor_type;
    const funds = req.body.fund_association;

    const resposne = await categoryService.listCategory();
    const resAll = await categoryService.listAll();
    const investorList = await investorService.listAll(false, {financial_year: financial_year, investor_type: investor_type, funds: funds});
    req.session.catList = resposne;
    res.locals.allCategory = JSON.stringify(resAll.message);
    res.locals.invSearchFields = JSON.stringify({financial_year: financial_year, investor_type: investor_type, funds: funds});
    const msg = req.session.msg;
    const catList = req.session.catList ? req.session.catList : [];
    req.session.msg = '';
    res.render(`./investor/investor-dashboard`, {
      message: msg,
      catList: catList,
      users:  req.session.users,
      roles: req.session.roleDetails,
      investorList: investorList.message
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = router;
