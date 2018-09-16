var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goodsRouter = require('./routes/goods');
// var addCartRouter = require('./routes/addCart');
var ejs = require('ejs');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// 登录拦截
app.use(function (req, res, next) {
  console.log(123);
  if (req.cookies.userId) {
    next();
  } else {
    console.log(`path=${req.path}; origin=${req.originalUrl}`)
    if (req.originalUrl == '/users/login' || req.originalUrl == '/users/logout' || req.originalUrl == '/users/reg' || req.path == '/goods/list') {
      next();
    } else {
      return res.json({
        status: "10001",
        msg: "请登录后进行操作",
        result: ""
      })
    }
  }
})

//路由信息
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goods', goodsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




module.exports = app;
