const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const partials = require('express-partials');
const session = require('express-session');
const _ = require('lodash');
//引入routes.js路由文件
const routes = require('./routes');
//引入setting文件
const SETTING = require('./setting');
//引入auth文件
const auth = require('./common/auth');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//当我们通过res.cookie在nodeJS中去向浏览器中去设置cookie的时候，cookie-parser
//这个插件会帮我们进行加密处理，而且是必须的，这样到客户端的value值是加密后的.
app.use(cookieParser(SETTING.cookie_secret));
app.use(session({
    //给session设置一些参数
    secret:SETTING.cookie_secret, //是给session加密的.通常应该是session存储的时候进行加密
    resave:true,
    saveUninitialized:true
    //这里暂时没有给session放入到redis或者是数据库里面去，因为感觉没有必要性.
}))

//使用该路由规则
app.use(auth.authUser);
//存储一下本地的信息
app.use((req,res,next)=>{
    res.locals.msg_count = req.session.msg_count;
    res.locals.isLogin = req.session.isLogin;
    res.locals.userInfo = req.session.user;
    next();
})
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
_.extend(app.locals, require('./common/markdown'));
app.listen(3000,()=>{
  console.log('node is OK');
})
module.exports = app;

