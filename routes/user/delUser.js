var express = require('express');
var router = express.Router();
var userService = require('../../services/user');

router.post('/', async function (req, res, next) {

    if (!req.session.loggedin) {
        res.redirect('./login');
    }
    let resposne = {message: "Unable to delete user", status: 500};
    try {
        const user_id = req.body.user_id;
        if (user_id) {
            resposne = await userService.deleteUser(user_id);
            req.session.msg = resposne.message;
        }
        res.send(resposne)
    } catch (err) {
        console.error(`Error while deleting user`, err.message);
        next(err);
    }
});

module.exports = router;
