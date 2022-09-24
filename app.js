var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');


const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const forgotPassRouter = require('./routes/forgot');
const loginSubmitRouter = require('./routes/login-submit');
const logoutRouter = require('./routes/logout');

const usersRouter = require('./routes/users');

const investorDashBoardRouter = require('./routes/investorDashBoard');

const documentCategoryRouter = require('./routes/categoryDashboard');
const addCategoryRouter = require('./routes/addCategory');
const editCategoryRouter = require('./routes/editCategory');


const app = express();

app.use(session({
  secret: 'z3partners.in',
  resave: true,
  saveUninitialized: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/index', indexRouter);

app.use('/login', loginRouter);
app.use('/forgot-password', forgotPassRouter);
app.use('/login-submit', loginSubmitRouter);
app.use('/logout', logoutRouter);

app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
