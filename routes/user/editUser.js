var express = require('express');
var router = express.Router();
var userService = require('../../services/user');

router.get('/', async function (req, res, next) {
    if (!req.session.loggedin) {
        res.redirect('./login');
    }
    req.session.msg = "User data not found!!";
    res.redirect('./users');
});

router.post('/', async function(req, res, next) {

    if(!req.session.loggedin) {
        res.redirect('./login');
    }

    const id = req.body['edit-id'];
    const userId = req.body.user_id;
    if(userId) {
        const first_name = req.body.first_name;
        const phone_number = req.body.contact_number;
        const role_id = req.body.user_role;
        const status = req.body.status ? 1 : 0;

        try {
            if(userId) {
                const resposne = await userService.updateUser({user_id: userId, first_name: first_name, phone_number: phone_number, role_id: role_id, status: status});
                req.session.msg = resposne.message;
                res.redirect('./users');
            }
        } catch (err) {
            console.error(`Error while getting investor details`, err.message);
            next(err);
        }
    } else {
        const rows = await userService.getUser(+id);
        if(rows.status === 200) {
            res.locals.user = JSON.stringify(rows.message[0]);
            res.render(`./user/edit-user`, {message: '', catList: '', users:  req.session.users, roles: req.session.roleDetails});
        } else {
            req.session.msg = "User data not found!!";
            res.redirect('./users');
        }
    }
});

module.exports = router;
