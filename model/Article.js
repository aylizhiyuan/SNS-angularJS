/**
 * Created by hama on 2017/5/10.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortid = require('shortid');
const SETTING = require('../setting');
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
    //最后回复的人
    last_reply:{
        type:String,
        ref:'User' //最后回复的人
    },
    //最后回复的时间
    last_reply_time:{
        type:Date,
        default:Date.now
    }
})
ArticleSchema.virtual('fenlei').get(()=>{
    //当前存储的分类
    let category = this.category;
    let pair ;
    //查看下当前存储的分类是不是合法的分类
    for(let item of SETTING.categorys){
        if(item[0] === category){
            return item[1];
        }else{
            return '';
        }
    }
})
ArticleSchema.static = {


}
const Article = mongoose.model('Article',ArticleSchema);
module.exports = Article

