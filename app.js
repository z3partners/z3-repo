var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const forgotPassRouter = require('./routes/forgot');
const loginSubmitRouter = require('./routes/login-submit');
const logoutRouter = require('./routes/logout');

const usersRouter = require('./routes/users');

const investorHomeRouter = require('./routes/investor/investorHome');
const investorDashBoardRouter = require('./routes/investor/investorDashBoard');
const addInvestorRouter = require('./routes/investor/addInvestor');
const editInvestorRouter = require('./routes/investor/editInvestor');
const delInvestorRouter = require('./routes/investor/delInvestor');
const investorPassRouter = require('./routes/investor/investorPass');
const submitInvestorPassRouter = require('./routes/investor/submitInvestorPass');

const documentCategoryRouter = require('./routes/category/categoryDashboard');
const addCategoryRouter = require('./routes/category/addCategory');
const deleteCategoryRouter = require('./routes/category/delCategory');
const documentSubCategoryRouter = require('./routes/category/subCategoryDashboard');
const addSubCategoryRouter = require('./routes/category/addSubCategory');

const uploadDocumentRouter = require('./routes/document/upload');
const editDocumentRouter = require('./routes/document/edit-document');
const deleteDocumentRouter = require('./routes/document/delDocument');
const documentDashboardRouter = require('./routes/document/documentDashboard');
const fileUploadRouter = require('./routes/document/fileUpload');
const sendDocumentRouter = require('./routes/document/sendDocument');




const app = express();

const oneDay = 1000*60*60*24;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, 'public')));

app.use(session({
  cookie:{
    maxAge: oneDay
  },
  secret: 'irportal.z3partners.com',
  resave: false,
  saveUninitialized: true
}));


app.use('/', investorDashBoardRouter);
app.use('/index', investorDashBoardRouter);
app.use('/inv-home', investorHomeRouter);

app.use('/login', loginRouter);
app.use('/forgot-password', forgotPassRouter);
app.use('/login-submit', loginSubmitRouter);
app.use('/logout', logoutRouter);

app.use('/users', usersRouter);

app.use('/investor', investorDashBoardRouter);
app.use('/add-investor', addInvestorRouter);
app.use('/edit-investor', editInvestorRouter);
app.use('/del-investor', delInvestorRouter);
app.use('/create-investor-pass', investorPassRouter);
app.use('/submit-investor-pass', submitInvestorPassRouter);


app.use('/category', documentCategoryRouter);
app.use('/add-category', addCategoryRouter);
app.use('/del-category', deleteCategoryRouter);

app.use('/sub-category/:id?', documentSubCategoryRouter);
app.use('/add-sub-category', addSubCategoryRouter);
app.use('/upload-document', uploadDocumentRouter);
app.use('/documents', documentDashboardRouter);
app.use('/file-upload', fileUploadRouter);
app.use('/send-document', sendDocumentRouter);
app.use('/edit-document', editDocumentRouter);
app.use('/del-document', deleteDocumentRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
