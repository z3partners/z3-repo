var express = require('express');
var router = express.Router();
const multer  = require('multer');
var categoryService = require('../../services/category');
var investorService = require('../../services/investor');
var documentService = require('../../services/document');
const filePath = './z3-documents';
const fs = require('fs');

var storage	=	multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, filePath);
    },
    filename: function (req, file, callback) {
        const fileName = `${Date.now()}_${file.originalname}`;
        callback(null, fileName);
    }
});

var upload = multer({ storage : storage}).single('uploadFile');

router.post('/', async function(req, res, next) {

/*    if(!req.session.loggedin) {
        res.redirect('./login');
    }*/

    try {
        upload(req, res, async function(err) {
            if(err) {
                return res.end("Error uploading document!!");
            }
            const document_name = req.body.document_name;
            const investor_id = req.body.investor_list.replaceAll("'", "");
            const financial_year = req.body.financial_year;
            const quarter = req.body.quarter;
            const category_id = req.body.selectCat;
            const sub_category_id = req.body.selectSubCat ? req.body.selectSubCat : '';
            const fund_association = req.body.fund_association ? req.body.fund_association : '';
            const status = req.body.status ? 1 : 0;
            const document_id = req.body.document_id;

            let dataForDB = {
                document_name: document_name,
                investor_id: +investor_id,
                financial_year: financial_year,
                quarter: quarter,
                category_id: +category_id,
                sub_category_id: +sub_category_id,
                fund_association: fund_association,
                status: status
            };
            if(req.file) {
                const file_path = JSON.stringify({originalname: req.file.originalname, filename: req.file.filename});
                dataForDB.file_path = file_path;
                if (req.body.oldfilepath) {
                    fs.unlinkSync(filePath + "/" + req.body.oldfilepath);
                }
            }
            if(document_id) {
                dataForDB.document_id = document_id;
                const resposne = await documentService.updateDocument(dataForDB);
                req.session.msg = resposne.message;
                res.redirect('./documents');
            } else {
                const resposne = await documentService.createDocument(dataForDB);
                req.session.msg = resposne.message;
                res.redirect('./documents');
            }
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

module.exports = router;
