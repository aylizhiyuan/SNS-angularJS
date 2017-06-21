/**
 * Created by hama on 2017/5/24.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortid = require('shortid');
const BaseModel = require('./base_model');
const MessageSchema = new Schema({
    /*
     * type:
     * reply: xx 回复了你的话题
     * comment: xx 在话题中回复了你
     * follow: xx 关注了你
     * at: xx ＠了你
     */
    _id:{
        type:String,
        default:shortid.generate,
        unique:true
    },
    type: { type: String },
    //消息发给谁
    target_id: { type: String,ref:'User'},
    //作者的ID
    author_id: { type: String,ref:'User'},
    //文章的ID
    article_id: { type: String,ref:'Article'},
    //回复的ID
    reply_id: { type: String,ref:'Reply'},
    has_read: { type: Boolean, default: false },
    create_time: { type: Date, default: Date.now }
})
MessageSchema.statics = {
    //根据用户的ID来获取未读消息的数量
    getMessagesCount : (id,callback)=>{
        Message.count({"target_id":id,"has_read":false},callback);
    },
    //根据用户的ID来获取未读消息的列表
    getUnreadMessage :(id,callback)=>{
        Message.find({"target_id":id,"has_read":false},null,{sort:'-create_time'}).populate('author_id').populate('article_id').populate('reply_id').exec(callback);
    },
    //根据用户的ID来获取已读消息的列表
    getReadMessage:(id,callback)=>{
        Message.find({"target_id":id,"has_read":true},null,{sort:'-create_time',limit:20}).populate('author_id').populate('article_id').populate('reply_id').exec(callback);
    },
    //将某个消息设置为已读
    updateMessage :(id,callback)=>{
        Message.update({'_id':id},{$set:{'has_read':true}}).exec(callback);
    },
    //将某个用户的所有消息设置为已读
    updateAllMessage:(user_id,callback)=>{
        Message.update({'target_id':user_id},{$set:{'has_read':true}},{multi:true}).exec(callback);
    }
}
MessageSchema.plugin(BaseModel);
const Message = mongoose.model('Message',MessageSchema);
module.exports = Message