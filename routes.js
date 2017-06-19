const express = require('express');
const router = express.Router();
//引入首页的路由文件
const home = require('./routes/home');
//引入问题的路由文件
const question = require('./routes/question');
const user = require('./routes/user');
const message = require('./routes/message');
const auth = require('./common/auth');
const reply = require('./routes/reply');
const comment = require('./routes/comment');
//---------------------------------首页-------------------------------------
router.get('/',home.index);
//登录
router.get('/login',auth.userNotRequired,home.login);
//注册
router.get('/register',auth.userNotRequired,home.register);
//注册行为
router.post('/register',home.postRegister);
//登录行为
router.post('/login',home.postLogin);
//退出
router.get('/logout',home.logout);

//-------------------------------问题页面--------------------------------
//新建
router.get('/question/create',auth.userRequired,question.create);
//新建的行为
router.post('/question/create',auth.userRequired,question.postCreate);
//编辑
router.get('/question/:id/edit',auth.userRequired,question.edit);
router.post('/question/:id/edit',auth.userRequired,question.postEdit);
//删除
router.post('/question/:id/delete',auth.userRequired,question.delete);
//详情
router.get('/question/:id',question.index)

//-------------------------------用户页面----------------------------------
//个人设置
router.get('/setting',auth.userRequired,user.setting);
//用户列表
router.get('/users',auth.userRequired,user.all);
//个人中心
router.get('/user/:name',auth.userRequired,user.index);
//用户发布问题的列表
router.get('/user/:name/questions',auth.userRequired,user.questions);
//用户回复的列表
router.get('/user/:name/replys',auth.userRequired,user.replys);

//-----------------------------留言回复列表-------------------------------------
router.post('/:article_id/reply',auth.userRequired,reply.add) //一级回复
router.post('/:article_id/comment',auth.userRequired,comment.add) //二级回复
router.post('/:reply_id/showComment',auth.userRequired,comment.show) //显示所有的二级回复
//------------------------------消息列表----------------------------------------
router.get('/my/messages',auth.userRequired,message.index);
router.get('/updateMessage/:id',auth.userRequired,message.updateMessage);
router.get('/updateAllMessage',auth.userRequired,message.updateAllMessage);
module.exports = router;



