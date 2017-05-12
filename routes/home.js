/**
 * Created by hama on 2017/5/9.
 */
//首页的所有请求都写在这儿.
//引入静态
const mapping = require('../static');
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