var express = require('express');
var router = express.Router();
var categoryService = require('../../services/category');
var investorService = require('../../services/investor');
var documentService = require('../../services/document');
const filePath = './z3-documents/';
const fs = require('fs');
const fileUpload = require('express-fileupload');
const emailService = require("../../services/email");
const emailTemplate = require('../../email-template/document/document-received');
const app = express();
app.use(fileUpload());

router.post('/',  async function(req, res) {
    if (!req.session.loggedin) {
        res.redirect('./login');
    }
    try {
        //console.log(req.files);
        const document_type = req.body.document_type;
        const selectSendTo = req.body.selectSendTo;
        const document_name = req.body.document_name;
        const financial_year = req.body.financial_year;
        const quarter = req.body.quarter;
        const category_id = req.body.selectCat;
        const sub_category_id = req.body.selectSubCat ? req.body.selectSubCat : '';
        const fund_association = req.body.fund_association ? req.body.fund_association : '';
        const status = req.body.status ? 1 : 0;
        const document_id = req.body.document_id;
        let dataForDB = {};
        if(document_type === 'general') {
             dataForDB = {
                 document_name: document_name,
                 send_to: selectSendTo,
                 investor_id: -999,
                 financial_year: null,
                 quarter: null,
                 category_id: +category_id,
                 sub_category_id: +sub_category_id,
                 fund_association: null,
                 status: status
            };
        } else {
            const investor_id = req.body.investor_list.replaceAll("'", "");
             dataForDB = {
                document_name: document_name,
                 send_to: null,
                investor_id: +investor_id,
                financial_year: financial_year,
                quarter: quarter,
                category_id: +category_id,
                sub_category_id: +sub_category_id,
                fund_association: fund_association,
                status: status
            };
        }

        let fileUploadStatus = true;
        if(req.files && Object.keys(req.files).length > 0) {
            const sampleFile = req.files.uploadFile;
            const originalName = sampleFile.name;
            const uploadFileName = `${Date.now()}_${sampleFile.name}`;
            const uploadPath = filePath + uploadFileName;
            sampleFile.mv(uploadPath, async function(err) {
                if(err) {
                    console.log(err);
                    fileUploadStatus = false;
                    return res.end("Error uploading document");
                }
            });
            const file_path = JSON.stringify({originalname: originalName, filename: uploadFileName});
            dataForDB.file_path = file_path;
            if (req.body.oldfilepath) {
                fs.unlinkSync(filePath + "/" + req.body.oldfilepath);
            }
        }
        if(fileUploadStatus) {
            const toEmail = req.session.username;
            if(document_id) {
                dataForDB.document_id = document_id;
                const resposne = await documentService.updateDocument(dataForDB);
                req.session.msg = resposne.message;
                // const transporter = emailService.getTransporter();
                // const textData = (emailTemplate.documentReceived.replace("{first_name}", req.session.users.fName)).replace("{document_name}", dataForDB.document_name);
                // const subject = 'Z3Partners: Document updated successfully';
                // const mailData = emailService.getMailData(toEmail, subject, textData);
                // transporter.sendMail(mailData, function (err, info) {
                //     if(err)
                //         console.log(err);
                //     else
                //         console.log(info);
                // });
                res.redirect('./documents');
            } else {
                const resposne = await documentService.createDocument(dataForDB);
                req.session.msg = resposne.message;
                // const transporter = emailService.getTransporter();
                // const textData = (emailTemplate.documentReceived.replace("{first_name}", req.session.users.fName)).replace("{document_name}", dataForDB.document_name);
                // const subject = 'Z3Partners: Document created successfully';
                // const mailData = emailService.getMailData(toEmail, subject, textData);
                // transporter.sendMail(mailData, function (err, info) {
                //     if(err)
                //         console.log(err);
                //     else
                //         console.log(info);
                // });
                res.redirect('./documents');
            }
        }

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

module.exports = router;
