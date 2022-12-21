var express = require('express');
var router = express.Router();
var userService = require('../../services/user');
const emailService = require("../../services/email");

router.post('/', async function (req, res, next) {

    if (!req.session.loggedin) {
        res.redirect('./login');
    }
    let resposne = {message: "Unable to delete user", status: 500};
    try {
        const user_id = req.body.user_id;
        if (user_id) {
            resposne = await userService.deleteUser(user_id);
            const transporter = emailService.getTransporter();
            const textData = 'User deleted successfully!!';
            const mailData = {
                from: 'auth@z3partners.com',  // sender address
                to: 'production2@4thdimension.in',   // list of receivers
                subject: 'Z3 Partners: User deleted successfully',
                text: textData
            };
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
