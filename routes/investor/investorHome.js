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
        res.locals.showFilter =  false;
        res.locals.showCat =  false;
        let searchParams = {};
        res.locals.docSearchFields = JSON.stringify({});
        searchParams.investor_id = req.session.users.user_id;
        const resposne = await categoryService.listCategory();
        const resAll = await categoryService.listAll();
        const investorList = await investorService.listAll(false, {});
        searchParams.limit = 6;
        const documentList = await documentService.listAll(true, searchParams);
        req.session.catList = resposne;
        res.locals.allCategory = JSON.stringify(resAll.message);
        res.locals.invSearchFields = JSON.stringify({});
        res.locals.documentList = JSON.stringify(documentList.message);
        const msg = req.session.msg;
        const catList = req.session.catList ? req.session.catList : [];
        req.session.msg = '';
        res.render(`./investor/investor-home`, {
            message: msg,
            catList: catList,
            users:  req.session.users,
            roles: req.session.roleDetails,
            investorList: investorList.message,
            documentList: documentList.message,
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
        let searchParams = {};
        //console.log(req.session.users);
        res.locals.showFilter =  true;
        let docCat = "-1";
        searchParams.investor_id = req.session.users.user_id;
        if(req.body.nav_cat_id) {
            searchParams.category_id = req.body.nav_cat_id;
            docCat = req.body.nav_cat_id;
        }
        res.locals.showCat = docCat;
        res.locals.docSearchFields = JSON.stringify(req.body);
        const start_date= req.body.start_date;
        const end_date= req.body.end_date;
        const quarter = req.body.quarter;
        const category_id = req.body.selectCat;
        if((start_date === '' && end_date !=='') || !isValidateDate(start_date, end_date)) {
            req.session.msg = 'Please choose validate date range!!';
        } else {
            (start_date && end_date ) ? searchParams.date_range = ` between '${start_date} 00:00:00' and '${end_date} 23:59:59' `: '';
            quarter ? searchParams.quarter = quarter : '';
            category_id ? searchParams.category_id = category_id : '';
        }
        const resposne = await categoryService.listCategory();
        const resAll = await categoryService.listAll();
        const investorList = await investorService.listAll(false, {});
        const documentList = await documentService.listAll(true, searchParams);
        req.session.catList = resposne;
        res.locals.allCategory = JSON.stringify(resAll.message);
        res.locals.invSearchFields = JSON.stringify({});
        res.locals.documentList = JSON.stringify(documentList.message);
        const msg = req.session.msg;
        const catList = req.session.catList ? req.session.catList : [];
        //console.log(req.session.roleDetails, req.session.users);
        req.session.msg = '';
        res.render(`./investor/investor-home`, {
            message: msg,
            catList: catList,
            users:  req.session.users,
            roles: req.session.roleDetails,
            investorList: investorList.message,
            documentList: documentList.message,
        });
    } catch (error) {
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
module.exports = router;
