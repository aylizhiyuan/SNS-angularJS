/**
 * Created by hama on 2017/5/18.
 */

const SETTING = require('../setting');
const User = require('../model/User');
const auth = {
    //生成cookie
    gen_session:(user,res)=>{
        //生成一个对应的值
        let auth_token = `${user._id}$$$$`;
        //向客户端设置cookie
        res.cookie(SETTING.auth_cookie_name,auth_token,{
            path: '/', maxAge: 1000 * 60 * 60 * 24 * 30, signed: true, httpOnly: true
        })
    },
    //使用cookie生成session,保留用户的登录状态
    authUser:(req,res,next)=>{
        if(req.session.user){
            req.session.isLogin = true;
            next();
        }else{
            //用户第一次登录的时候，通过客户端带来的cookie信息来生成session
            //读取用户的cookie信息,这次读取的时候是以解密的形式读取的.
            let auth_token = req.signedCookies[SETTING.auth_cookie_name];
            let auth = auth_token.split('$$$$');
            let user_id = auth[0];
            //根据cookie中的ID去user表中找用户信息
            User.findOne({'_id' : user_id},function(err,user){
                if(err){
                    console.log(err)
                }else{
                    if(!user){
                        return next();
                    }
                    req.session.user = user;
                    req.session.isLogin = true;
                    return next();
                }
            })
        }
    }
}
module.exports = auth;
