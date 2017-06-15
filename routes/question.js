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
const at = require('../common/at');
//这里使用了缓存的技术
//const cache = require('../util/cache');
exports.index = (req,res,next)=>{
    //获取文章的ID
    let article_id = req.params.id;
    //获取当前登录的作者
    let currentUser = req.session.user;
    //获取文章详情、文章的作者信息、文章的回复列表
    //这次callback要返回很多数据，因此关于错误的判断就显得尤为的谨慎了。
    Article.getFullArticle(article_id,function(err,message,article,replies){
       if(message !== ''){
           res.render('error',{
               message:message,
               error:''
           })
       }
       if(err){
           res.render('error',{
               message:'',
               error:err
           })
       }
       article.click_num += 1;
       article.save();
       article.replies = replies;
       //console.log(replies);
       //获取这个作者的其他文章
       let options = {limit:5,sort:'-last_reply_time'};
       let query = {author:article.author,_id:{'$nin':[article._id]}};
       Article.getArticleByQuery(query,options,function(err,articles){
           res.render('question',{
               title:'问题--社区问答系统',
               layout:'indexTemplate',
               article:article,
               other_article:articles
           })
       })
    })
}
exports.create = (req,res,next)=>{
    res.render('create-question',{
        title:'新建--社区问答系统',
        layout:'indexTemplate',
        categorys:SETTING.categorys
    })
}
exports.postCreate = (req,res,next)=>{
    //文章的标题
    let title = validator.trim(req.body.title);
    //文章的内容
    let content = validator.trim(req.body.content);
    //文章的分类
    let category = validator.trim(req.body.category);
    let error;
    //获取所有的分类
    const allTabs = SETTING.categorys.map(function (tPair) {
        return tPair[0];
    });
    if(!validator.isLength(title,{min:10,max:50})){
        error = '文章的标题长度不能少于10个字符或者多于50个字符'
    }
    if(!validator.isLength(content,0)){
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
        newObj.save().then(article=>{
            //发布成功后，对应的用户的积分和发布文章数量+1
            User.getUserById(req.session.user._id,(err,user)=>{
                user.score += 5;
                user.article_count += 1;
                user.save();
                req.session.user = user;
                res.json({url:`/question/${article._id}`});
            })
            //发送at消息
            at.sendMessageToMentionUsers(content,article._id,req.session.user._id);
        }).catch(err=>{
            res.end(err);
        })
    }
}
//编辑页面
exports.edit = (req,res,next)=>{
    var article_id = req.params.id;
    Article.getArticle(article_id,(err,article)=>{
        if(!article){
            return res.render('error',{
                message:'此话题不存在或已被删除',
                error:''
            })
        }
        if(String(article.author._id) === String(req.session.user._id)){
            return res.render('edit-question',{
                title:'编辑--社区问答系统',
                layout:'indexTemplate',
                categorys:SETTING.categorys,
                article:article
            })
        }else{
            res.render('error',{
                message:'对不起，你没有权限编辑此文章',
                error:''
            })
        }
    })
}
//编辑这篇文章
exports.postEdit = (req,res,next)=>{
    var article_id = req.params.id;
    var content = validator.trim(req.body.content);
    var category = validator.trim(req.body.category);
    var title = validator.trim(req.body.title);
    //首先检查下这篇文章是否存在
    Article.getArticle(article_id,(err,article)=>{
        if(!article){
            return end('此话题已经不存在了,请重新检查');
        }
        if(String(article.author._id) === String(req.session.user._id)){
            let error;
            //获取所有的分类
            const allTabs = SETTING.categorys.map(function (tPair) {
                return tPair[0];
            });
            if(!validator.isLength(title,{min:10,max:50})){
                error = '文章的标题长度不能少于10个字符或者多于50个字符'
            }
            if(!validator.isLength(content,0)){
                error = '文章的内容不能为空';
            }
            if(!category || !allTabs.includes(category)){
                error = '必须选择一个分类';
            }
            if(error) {
                res.end(error);
            }else{
                article.title = title;
                article.content = content;
                article.category = category;
                article.update_time = new Date();
                article.save().then((article)=>{
                    at.sendMessageToMentionUsers(content,article._id,req.session.user._id);
                    return res.json({url:`/question/${article._id}`});
                }).catch(err=>{
                    return res.end(err);
                })
            }
        }else{
            return res.end('此话题您不具备编辑的能力');
        }
    })
}
//删除这篇文章
exports.delete = (req,res,next)=>{
    let article_id = req.params.id;
    Article.getFullArticle(article_id,(err,message,article,replies)=>{
        if(err){
            return res.json({success:false,message:err})
        }
        if(message !== ''){
            return res.json({success:false,message:message})
        }
        //判断下有无权限
        if(String(article.author._id) === String(req.session.user._id)){
            //文章的作者积分和回复量减少
            article.author.score -= 5;
            article.author.article_count -= 1;
            article.author.save();
            //文章的状态为删除状态
            article.deleted = true;
            article.save().then((article)=>{
                return res.json({success:true,message:'删除成功'})
            }).catch(err=>{
                return res.json({success:false,message:err})
            })
        }else{
            return res.json({success:false,message:'您没有权限进行删除'})
        }
    })
}

