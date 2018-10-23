var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
var history = require('connect-history-api-fallback')

var cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

var mongoose = require('./config/mongoose');
var db = mongoose();

var app = express();

app.use(cors({
  // origin: ['http://localhost:8080'],
  // origin: ['http://localhost'],
  origin: ['http://47.107.75.183','http://lymon.top','http://www.lymon.top','http://localhost','http://localhost:8080'], // 生产环境
	methods: ['GET','POST'],
  alloweHeaders: ['Conten-Type','Authorization'],
  credentials: true
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //开发环境
// app.use(express.static(path.join(__dirname, 'dist'))) //上线环境

//使用session
//1. 客户端登录之后向服务器发送请求，将用户名作为session的值发送到服务器
//2. 服务器设置好session的属性，例如保存时间，加密，存储的数据库等
//3. 服务器接收到客户端发送的session，将session保存下来
//4. 客户端第二次打开需要登录的页面，服务器首先获取session中的值，如果不存在则提示重新登录
app.use(session({
  secret: '123456', //加密字符串
  resave: true, //强制保存session，建议设置成false
  saveUninitialized: true, //强制保存未初始化的内容
  cookie: {maxAge: 1000 * 3600 * 6}, //保存时效
  store: new MongoStore({ //将session存进数据库
    url: 'mongodb://Lymon:myTest18@localhost:27017/test',
    // touchAfter: 60 * 10 //在10分钟内只更新一次会话，不管有多少请求
  })
}))

// 请求拦截器， 必须放在静态资源之后，路由导航之前
app.use(function(req, res, next) {
  // 判断session是否存在
  if(req.session && req.session._id) {
    next()
  } else {
    let url = req.url

    // 判断路径是否为管理页面路径
    if(url.indexOf('admin') !== -1) {
      // 判断路径是否为登录或注册路径
      if(url.indexOf('login') !== -1 || url.indexOf('register') !== -1) {
        next()
      } else {
        res.send({
          errorMsg: '请登录'
        })
      }
    } else {
      next()
    }
  }
})

app.use(history())

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);




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
