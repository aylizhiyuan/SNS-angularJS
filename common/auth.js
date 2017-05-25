/**
 * Created by hama on 2017/5/18.
 */

const SETTING = require('../setting');
const User = require('../model/User');
const Message = require('../model/Message');
const auth = {
    //判断用户是否具备操作权限的检测
    userRequired:(req,res,next)=>{
        if(!req.session || !req.session.user || !req.session.user._id ){
            return res.status(403).send('forbidden!');
        }
        next();
    },
    //判断用户是否是登录状态，如果是登录状态，不能让用户访问剩余的页面
    userNotRequired:(req,res,next)=>{
      if(req.session.isLogin == true){
          return res.status(403).send('已经登录了，请返回操作');
      }
      next();
    },
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
            Message.getMessagesCount(req.session.user._id,(err,count)=>{
                req.session.msg_count = count;
                req.session.isLogin = true;
                next();
            })
        }else{
            //用户第一次登录的时候，通过客户端带来的cookie信息来生成session
            //读取用户的cookie信息,这次读取的时候是以解密的形式读取的.
            let auth_token = req.signedCookies[SETTING.auth_cookie_name];
            if(!auth_token){
                return next();
            }else{
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
                        Message.getMessagesCount(user_id,(err,count)=>{
                            req.session.msg_count = count;
                            req.session.user = user;
                            req.session.isLogin = true;
                            return next();
                        })
                    }
                })
            }
        }
    }
}
module.exports = auth;
