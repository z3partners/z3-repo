var express = require('express');
var router = express.Router();
const users = require('../services/user');
const admin_roles = [1, 4, 5];

/* post login page. */
router.post('/', async function(req, res, next) {
  const emailUsername = req.body.emailUsername;
  const password = req.body.password;
  if(!emailUsername || !password) {
    res.render('login/login', { message: 'Invalid Username/Password. Please try again.' });
  } else  {
    try {
      const resposne = await users.loginUser(emailUsername, password);
      // console.log("==>resposne==>", resposne);
      if(resposne.status===200) {
        req.session.loggedin = true;
        req.session.username = emailUsername;
        const userCreatedDate = resposne.message.userDetail.created_at;
        req.session.users = {
          "user_id": resposne.message.userDetail.user_id,
          "fName": resposne.message.userDetail.first_name,
          "lName":resposne.message.userDetail.last_name,
          'cname': resposne.message.userDetail.company_legal_name,
          'investorType': resposne.message.userDetail.investor_type,
          'alt_email_1': resposne.message.userDetail.alt_email_1,
          'alt_email_2': resposne.message.userDetail.alt_email_2,
          'created_at': userCreatedDate
        };
        req.session.roleDetails = resposne.message.roleDetails;
         //console.log(resposne);
        if(admin_roles.includes(resposne.message.roleDetails.role_id)) {
          res.redirect('./index');
        } else {
          res.redirect('./inv-home');
        }

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
});

router.get('/', async function(req, res, next) {
  res.render('login/login', { message: '' });
});

module.exports = router;
