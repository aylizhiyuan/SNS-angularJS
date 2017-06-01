/**
 * Created by hama on 2017/5/10.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortid = require('shortid');
const SETTING = require('../setting');
const at = require('../common/at');
const User = require('../model/User');
const Reply = require('../model/Reply');
const _ = require('lodash');
const BaseModel = require('./base_model');
const ArticleSchema = new Schema({
    _id:{
        type:String,
        default:shortid.generate,
        unique:true
    },
    //文章的标题
    title:{
        type:String,
        require:true
    },
    //文章的内容
    content:{
        type:String,
        require:true
    },
    //创建时间
    create_time:{
        type:Date,
        default:Date.now
    },
    //修改时间
    update_time:{
        type:Date,
        default:Date.now
    },
    //标签
    tags:String,
    //点击量
    click_num:{
        type:Number,
        default:0,
        min:0,
        max:100000
    },
    //回复量
    comment_num:{
        type:Number,
        default:0,
        min:0,
        max:100000
    },
    //关注量
    follow_num:{
        type:Number,
        default:0,
        min:0,
        max:100000
    },
    //作者,它应该一个user表中的数据
    author:{
        type:String,
        ref:'User' //文章的作者
    },
    //文章的分类
    category:{
        type:String
    },
    //最后的回复
    last_reply:{
        type:String,
        ref:'Reply' //最后回复的帖子
    },
    //最后回复的时间
    last_reply_time:{
        type:Date,
        default:Date.now
    },
    //增加删除功能
    deleted:{
        type:Boolean,
        default:false
    }
})
ArticleSchema.virtual('categoryName').get(function(){
    //当前存储的分类
    let category = this.category;
    //查看下当前存储的分类是不是合法的分类
    let pair = _.find(SETTING.categorys, function (_pair) {
        return _pair[0] === category;
    });
    if(pair){
        return pair[1];
    }else{
        return '';
    }
})
ArticleSchema.statics = {
    //.all方法通常用在数据之间没有关联的时候
    //.then的链式调用通常用在数据有相互关联的时候
    //获取文章的所有信息
    getArticle:(id,callback)=>{
        //1.首先检查下这篇文章是否存在
        Article.findOne({'_id':id,'deleted':false}).populate('author').populate('last_reply').then(article=>{
            if(!article){
                return callback(null,'该问题不存在或者已被删除');
            }
            if(!article.author){
                return callback(null,'该问题的作者没了');
            }
            article.linkContent = at.linkUsers(article.content);
            //2.根据这篇文章的ID查询出对应的回复列表
            Reply.getRepliesByTopicId(article._id,(err,replies)=>{
                return callback(null,'',article,replies);
            })
        }).catch((err)=>{
            return callback(err);
        })
    },
    //根据条件获取文章列表
    getArticleByQuery:(query,opt,callback)=> {
        query.deleted = false;
        Article.find(query,{},opt).populate('author').populate('last_reply').then((articles)=>{
            if(articles.length == 0){
                return callback(null,[]);
            }
            //如果这篇文章的作者已经被删除，那么它这篇文章应该也设置为空
            //暂时先不做这方面的工作，因为感觉现在还没必要
            return callback(null,articles);
        }).catch(err=>{
            return callback(err);
        })
    }
}
ArticleSchema.plugin(BaseModel);
const Article = mongoose.model('Article',ArticleSchema);
module.exports = Article

