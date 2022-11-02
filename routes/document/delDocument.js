var express = require('express');
var router = express.Router();
var documentService = require('../../services/document');

router.post('/', async function (req, res, next) {

    if (!req.session.loggedin) {
        res.redirect('./login');
    }
    let resposne = {message: "Unable to delete document", status: 500};
    try {
        const document_id = req.body.document_id;
        if (document_id) {
            resposne = await documentService.deleteDocument(document_id);
            req.session.msg = resposne.message;
        }
        res.send(resposne)
    } catch (err) {
        console.error(`Error while getting category details`, err.message);
        next(err);
    }
});

module.exports = router;
