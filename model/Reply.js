/**
 * Created by hama on 2017/5/10.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortid = require('shortid');
const at = require('../common/at');
const BaseModel = require('./base_model');
const ReplySchema = new Schema({
    _id:{
        type:String,
        default:shortid.generate,
        unique:true
    },
    //留言的内容
    content:{
        type:String,
        require:true,
        default:'请输入留言的内容...'
    },
    //留言的时间
    create_time:{
        type:Date,
        default:Date.now
    },
    //留言的修改时间
    update_time:{
        type:Date,
        default:Date.now
    },
    //留言的作者
    author:{
        type:String,
        ref:'User' //关联用户表
    },
    //二级回复的时候设置它,回复的ID
    reply_id:{
        type:String,
        ref:'Reply'
    },
    //留言的对应文章
    article_id:{
        type:String,
        ref:'Article'
    },
    //增加删除功能
    deleted:{
        type:Boolean,
        default:false
    },
    //增加点赞功能
    likes:{
        type:[String],
        ref:'User'
    }
})
ReplySchema.statics = {
    getRepliesByTopicId:(id,callback)=>{
        Reply.find({'article_id':id,'deleted':false},'',{sort:'create_time'}).populate('author').then(replies=>{
            if(replies.length === 0){
                return callback(null,[]);
            }
            for(let index of replies.keys()){
                replies[i].content = at.linkUsers(replies[i].content);
            }
            return callback(null,replies);
        }).catch(err=>{
            return callback(err);
        })
    }
}
ReplySchema.plugin(BaseModel);
const Reply = mongoose.model('Reply',ReplySchema);
module.exports = Reply
