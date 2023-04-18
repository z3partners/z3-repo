var express = require("express");
var router = express.Router();
const users = require("../services/user");
const categoryService = require("../services/category");
const investorService = require("../services/investor");
const emailService = require("../services/email");
const emailTemplate = require("../email-template/user/changed-password");

/* GET home page. */
router.post("/", async function (req, res, next) {
  if (!req.session.loggedin) {
    res.redirect("./login");
  }
  const id = req.body["edit-id"];
  const userId = req.session.users.user_id;
  const catList = req.session.catList ? req.session.catList : [];
  const username = res.req.session.username;
  if (id) {
    const investor = await investorService.getInvestor(
      id,
      req.session.roleDetails.role_id
    );
    res.locals.investor = JSON.stringify(investor.message);
    if (!Array.isArray(investor.message)) {
      req.session.msg = "Something went wrong. Please try again.";
      res.render(`./login/change-pass`, {
        message: req.session.msg,
        catList: catList,
        users: req.session.users,
        roles: req.session.roleDetails,
      });
    } else {
      res.locals.investor = JSON.stringify(investor.message);
      res.render(`./login/change-pass`, {
        message: req.session.msg,
        catList: catList,
        users: req.session.users,
        roles: req.session.roleDetails,
      });
    }
  } else {
    const password = req.body.password;
    const firstName = req.body.first_name;
    const newPassword = req.body.new_password;
    const confirmPassword = req.body["confirm-password"];
    const passRes = await users.changePassword(userId, password, newPassword);
    if (passRes.status === 200) {
      req.session.destroy(function (err) {});

      const transporter = emailService.getTransporter();
      const textData = ((emailTemplate.changePassword.replace('{first_name}', firstName)).replace("{created_updated}", 'updated')).replace("{{password}}", password);
      const subject = "Z3Partners: Password changed successfully";
      const mailData = emailService.getMailData([username], subject, textData);
      transporter.sendMail(mailData, function (err, info) {});
      res.render("login/login", {
        message: "Password updated, please re-login.",
      });
    } else {
      const investor = await investorService.getInvestor(userId);
      res.locals.investor = JSON.stringify(investor.message);
      req.session.msg = passRes.message;
      res.render(`./login/change-pass`, {
        message: req.session.msg,
        catList: catList,
        users: req.session.users,
        roles: req.session.roleDetails,
      });
    }
  }
});

module.exports = router;
