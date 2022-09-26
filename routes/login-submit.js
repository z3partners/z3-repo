var express = require('express');
var router = express.Router();
const users = require('../services/users');

/* post login page. */
router.post('/', async function(req, res, next) {
  const emailUsername = req.body.emailUsername;
  const password = req.body.password;
  if(!emailUsername || !password) {
    res.render('login/login', { message: 'Invalid Username/Password. Please try again!!' });
  } else  {
    try {
      const resposne = await users.loginUser(emailUsername, password);
      if(resposne.status===200) {
        req.session.loggedin = true;
        req.session.username = emailUsername;
        req.session.users = {"fName": resposne.message.userDetail.first_name, "lName":resposne.message.userDetail.last_name};
        req.session.roleDetails = resposne.message.roleDetails;
        // console.log(req.session);
        res.redirect('./index');
      } else {
        req.session.loggedin = false;
        req.session.msg = resposne.message;
        res.redirect('./login');
      }
  } catch (err) {
    console.error(`Error while getting user login `, err.message);
    next(err);
  }
  }
/*  try {
    res.json(await users.loginUser(emailUsername, password));
  } catch (err) {
    console.error(`Error while getting user login `, err.message);
    next(err);
  }*/
/*
  try {
    res.json(await users.createUser({username:emailUsername, password: password}));
  } catch (err) {
    console.error(`Error while getting user login `, err.message);
    next(err);
  }
*/


  // res.render('login/login', { message: 'Invalid Username/Password. Please try again!!' });
  /*if (!password || !emailUsername) {
    res.render('login/login', { message: 'Invalid Username/Password. Please try again!!' });
  } else {
    res.render('investor/investor-dashboard');
  }*/
});
router.get('/', async function(req, res, next) {
  res.render('login/login', { message: '' });
});

module.exports = router;
