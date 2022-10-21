var express = require('express');
var router = express.Router();
var categoryService = require('../../services/category');
var investorService = require('../../services/investor');
var documentService = require('../../services/document');

/* GET home page. */
router.get('/', async function(req, res, next) {

    if(!req.session.loggedin) {
        res.redirect('./login');
    }

    try {

        const resposne = await categoryService.listCategory();
        const resAll = await categoryService.listAll();
        const investorList = await investorService.listAll(false, {});
        const documentList = await documentService.listAll(false, {});
        req.session.catList = resposne;
        res.locals.allCategory = JSON.stringify(resAll.message);
        res.locals.investorList = JSON.stringify(investorList.message);
        res.locals.docSearchFields = JSON.stringify({});
        //res.locals.roles =  JSON.stringify(req.session.roleDetails);
        const msg = req.session.msg;
        const catList = req.session.catList ? req.session.catList : [];
        req.session.msg = '';
        res.render(`./documents/documents-dashboard`, {
            message: msg,
                catList: catList,
                users:  req.session.users,
                roles:  req.session.roleDetails,
                documentList: documentList.message,
                investorList: investorList.message
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.post('/', async function(req, res, next) {

    if(!req.session.loggedin) {
        res.redirect('./login');
    }

    try {

        const start_date= req.body.start_date;
        const end_date= req.body.end_date;
        const quarter = req.body.quarter;
        const category_id = req.body.selectCat;
        const sub_category_id = req.body.selectSubCat;
        let searchParams = {};
        if((start_date === '' && end_date !=='') || !isValidateDate(start_date, end_date)) {
            req.session.msg = 'Please choose validate date range!!';
        } else {
            (start_date !== '' && end_date !=='') ? searchParams.date_range = ` between '${start_date} 00:00:00' and '${end_date} 23:59:59' `: '';
            quarter ? searchParams.quarter = quarter : '';
            category_id ? searchParams.category_id = category_id : '';
            sub_category_id ? searchParams.sub_category_id = sub_category_id : '';
        }
        let searchParamToSelect = req.body;
        const resposne = await categoryService.listCategory();
        const resAll = await categoryService.listAll();
        const investorList = await investorService.listAll(false, {});
        const documentList = await documentService.listAll(false, searchParams);
        req.session.catList = resposne;
        res.locals.allCategory = JSON.stringify(resAll.message);
        res.locals.investorList = JSON.stringify(investorList.message);
        res.locals.docSearchFields = JSON.stringify(searchParamToSelect);
        //res.locals.roles =  JSON.stringify(req.session.roleDetails);
        const msg = req.session.msg;
        const catList = req.session.catList ? req.session.catList : [];
        req.session.msg = '';
        res.render(`./documents/documents-dashboard`, {
            message: msg,
                catList: catList,
                users:  req.session.users,
                roles:  req.session.roleDetails,
                documentList: documentList.message,
                investorList: investorList.message
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

function getTimeStamp(date) {
   const  myDate = date.split("-");
    return new Date( myDate[0], myDate[1] - 1, myDate[2]);
}

function isValidateDate(start_date, end_date) {
    let sDateTimestmp = 0;
    let eDateTimestmp = 0;
    if(start_date) {
        sDateTimestmp = getTimeStamp(start_date);
    }
    if(end_date) {
        eDateTimestmp = getTimeStamp(end_date);
    }
    if(sDateTimestmp > eDateTimestmp) {
        return false;
    }
    return true;

}
//console.log(newDate.getTime());

module.exports = router;
