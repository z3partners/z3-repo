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

const investorDashBoardRouter = require('./routes/investorDashBoard');

const documentCategoryRouter = require('./routes/categoryDashboard');
const addCategoryRouter = require('./routes/addCategory');
const deleteCategoryRouter = require('./routes/delCategory');

const documentSubCategoryRouter = require('./routes/subCategoryDashboard');
const addSubCategoryRouter = require('./routes/addSubCategory');


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

//
app.use(session({
  cookie:{
    maxAge: oneDay
  },
  //store: new RedisStore(),
  secret: 'z3partners.in',
  resave: false,
  saveUninitialized: true
}));


/*app.use(session({
  cookie: { maxAge: oneDay },
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  resave: false,
  secret: 'z3partners.com',
  saveUninitialized: true
}));*/


app.use('/', indexRouter);
app.use('/index', indexRouter);

app.use('/login', loginRouter);
app.use('/forgot-password', forgotPassRouter);
app.use('/login-submit', loginSubmitRouter);
app.use('/logout', logoutRouter);

app.use('/users', usersRouter);

app.use('/investor', investorDashBoardRouter);

app.use('/category/:id?', documentCategoryRouter);
app.use('/add-category', addCategoryRouter);
app.use('/del-category', deleteCategoryRouter);

app.use('/sub-category/:id?', documentSubCategoryRouter);
app.use('/add-sub-category', addSubCategoryRouter);
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
