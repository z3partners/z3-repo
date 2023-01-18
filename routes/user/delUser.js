var express = require('express');
var router = express.Router();
var userService = require('../../services/user');
const emailService = require("../../services/email");
const emailTemplate = require("../../email-template/user/delete-account");

router.post('/', async function (req, res, next) {

    if (!req.session.loggedin) {
        res.redirect('./login');
    }
    let resposne = {message: "Unable to delete user", status: 500};
    try {
        const user_id = req.body.user_id;
        const username = req.body.username;
        if (user_id) {
            resposne = await userService.deleteUser(user_id);
            const transporter = emailService.getTransporter();
            const textData = emailTemplate.deleteAccount.replace("{username}", req.session.users.fName);
            const subject = 'Z3Partners: User deleted successfully';
            const mailData = emailService.getMailData('partner@z3partners.com', subject, textData);

            transporter.sendMail(mailData, function (err, info) {
                if(err)
                    console.log(err);
                else
                    console.log(info);
            });
            req.session.msg = resposne.message;
        }
        res.send(resposne)
    } catch (err) {
        console.error(`Error while deleting user`, err.message);
        next(err);
    }
});

module.exports = router;
