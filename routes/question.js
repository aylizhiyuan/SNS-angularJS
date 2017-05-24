/**
 * Created by hama on 2017/5/12.
 */
//引入静态
const mapping = require('../static');
const SETTING = require('../setting');
const validator = require('validator');
const DbSet = require('../model/db');
const Article = require('../model/Article');
const User = require('../model/User');
//这里使用了缓存的技术
const cache = require('../util/cache');
exports.index = (req,res,next)=>{
    res.render('question',{
        title:'问题--社区问答系统',
        layout:'indexTemplate'
    })
}
exports.create = (req,res,next)=>{
    res.render('create-question',{
        title:'新建--社区问答系统',
        layout:'indexTemplate',
        categorys:SETTING.categorys
    })
}
exports.edit = (req,res,next)=>{
    res.render('edit-question',{
        title:'编辑--社区问答系统',
        layout:'indexTemplate'
    })
}
exports.postCreate = (req,res,next)=>{
    //文章的标题
    let title = req.body.title;
    //文章的内容
    let content = req.body.content;
    //文章的分类
    let category = req.body.category;
    let error;
    //获取所有的分类
    const allTabs = SETTING.categorys.map(function (tPair) {
        return tPair[0];
    });
    if(validator.isLength(title)){
        error = '文章的标题长度不能少于10个字符或者多于50个字符'
    }
    if(validator.isLength(content)){
        error = '文章的内容不能为空';
    }
    if(!category || !allTabs.includes(category)){
        error = '必须选择一个分类';
    }
    if(error){
        res.end(error);
    }else{
        req.body.author = req.session.user._id;
        let newObj = new Article(req.body);
        newObj.save().then(result=>{
            //发布成功后，对应的用户的积分和发布文章数量+1
            User.getUserById(req.session.user._id,(err,user)=>{
                console.log(user);
                user.score += 5;
                user.article_count += 1;
                user.save();
                req.session.user = user;
                res.json({url:`/question/${result._id}`});
            })
        }).catch(err=>{
            res.end(err);
        })
    }
}
