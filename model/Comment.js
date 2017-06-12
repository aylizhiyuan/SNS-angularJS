/**
 * Created by hama on 2017/6/8.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortid = require('shortid');
const BaseModel = require('./base_model');
const at = require('../common/at');
const markdown = require('../common/markdown');
const CommentSchema = new Schema({
    _id:{
        type:String,
        default:shortid.generate,
        unique:true
    },
    //对应的一级回复的ID
    reply_id:{
        type:String,
        ref:'Reply'
    },
    //二级留言的人
    author_id:{
        type:String,
        ref:'User'
    },
    //二级回复的对象,默认应该是留言的作者，但是也有可能是其他二级回复的人
    reply_author_id:{
        type:String,
        ref:'User'
    },
    //二级回复的内容
    content:{
        type:String
    },
    //二级回复的时间
    create_time:{
        type:Date,
        default:Date.now
    },
    //同时也可以给二级留言进行点赞
    likes:{
        type:[String],
        ref:'User'
    }
})
CommentSchema.statics = {
    getCommentsByReplyId:(id,callback)=>{
        Comment.find({'reply_id':id},'',{sort:'create_time'}).populate('author_id').populate('reply_author_id').then(comments=>{
            if(comments.length === 0){
                return callback(null,[]);
            }
            for(let index of comments.keys()){
                comments[index].content = at.linkUsers(comments[index].content);
                comments[index].content = markdown.markdown(comments[index].content);
            }
            return callback(null,comments);
        }).catch(err=>{
            return callback(err);
        })
    }
}
CommentSchema.plugin(BaseModel);
const Comment = mongoose.model('Comment',CommentSchema);
module.exports = Comment;