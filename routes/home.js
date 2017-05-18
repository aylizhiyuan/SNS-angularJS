/**
 * Created by hama on 2017/5/9.
 */
//首页的所有请求都写在这儿.
//引入静态
const mapping = require('../static');
//引入表单验证
const validator = require('validator');
//引入User表
const User = require('../model/User');
//引入数据库连接文件
const DbSet = require('../model/db');
//引入配置文件
const SETTING = require('../setting');
//引入发送邮件的通用方法
const mail = require('../common/mail');
exports.index = (req,res,next)=>{
    res.render('index',{
        title:'首页--社区问答系统',
        layout:'indexTemplate'
    })
}
exports.login = (req,res,next)=>{
    res.render('login',{
        title:"登录页面--社区问答系统",
        layout:'indexTemplate',
        resource:mapping.login
    })
}
exports.register = (req,res,next)=>{
    res.render('register',{
        title:'注册页面--社区问答系统',
        layout:'indexTemplate',
        resource:mapping.register
    })
}
// 注册行为
exports.postRegister = (req,res,next)=>{
    //1.后端验证数据
    let name = req.body.name;
    let password = req.body.password;
    let email = req.body.email;
    let error;
    if(!validator.matches(name,/^[a-zA-Z][a-zA-Z0-9_]{4,11}$/,'g')){
        error = '用户名不合法,5-12位,数字字母下划线'
    }
    if(!validator.matches(password,/(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{5,}/,'g') ||
    !validator.isLength(password,6,12)){
        error = '密码长度5-12位，非特殊字符'
    }
    if(!validator.isEmail(email)){
        error = '邮箱的格式不正确'
    }
    //如果验证的有错误，那么发送这个错误的提示信息
    if(error){
        res.end(error);
    }else{
        //验证成功之后,判断一下用户名和邮箱是否存在
        let query = User.find().or([{email:email},{name:name}]);
        query.exec().then((user)=>{
            if(user.length > 0){
                error = '用户名/邮箱已存在';
                res.end(error);
            }else{
                let regMsg = {name:name,email:email};
                mail.sendEmail('reg_mail',regMsg,function(err,info){
                    if(err){
                        res.end(err);
                    }
                });
                let newPSD = DbSet.encrypt(password,SETTING.PSDkey);
                req.body.password = newPSD;
                DbSet.addOne(User,req,res,'success');
            }
        }).catch((err)=>{
            res.end(err);
        })
    }
}
//登录行为
exports.postLogin = (req,res,next)=>{
    let error;
    let username = req.body.username;
    let getEmail;
    let getName;
    let getUser;
    let password = req.body.password;
    username.includes('@') ? getEmail = username : getName = username;
    if(getName){
        if(!validator.matches(getName,/^[a-zA-Z][a-zA-Z0-9_]{4,11}$/,'g')){
            error = '用户名格式不正确';
        }
    }
    if(getEmail){
        if(!validator.isEmail(getEmail)){
            error = '邮箱格式不正确';
        }
    }
    if(!validator.matches(password,/(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{5,}/,'g')||
        !validator.isLength(password,6,12)){
        error = '密码格式不正确';
    }
    if(error){
        res.end(error);
    }else{
        //根据邮箱来查用户 getUserByEmail
        //根据用户名来查用户 getUserByName
        if(getEmail){
            getUser = User.getUserByEmail
        }else{
            getUser = User.getUserByName
        }
        getUser(username,(err,user)=>{
            if(err){
                res.end(err);
            }
            //你根据邮箱或者是用户名查到的用户信息
            if(!user){
                res.end('用户名/邮箱不存在');
            }else{
                //判断密码是否一样
                let newPSD = DbSet.encrypt(password,SETTING.PSDkey);
                if(user.password !== newPSD){
                    res.end('密码错误,请重新输入');
                }
                res.end('success');
            }
        })
    }
    //1.验证
    //2.判断一下是用户名登录还是邮箱登录
    //3.查找用户名或者邮箱是否存在
    //4.对应的密码是否一致
    //5.登录后，创建cookie,通过cookie生成session，完成最后的登录

}