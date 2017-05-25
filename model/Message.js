/**
 * Created by hama on 2017/5/24.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortid = require('shortid');
const User = require('./User');
const Article = require('./Article');
const MessageSchema = new Schema({
    /*
     * type:
     * reply: xx 回复了你的话题
     * reply2: xx 在话题中回复了你
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
    reply_id: { type: String },
    has_read: { type: Boolean, default: false },
    create_at: { type: Date, default: Date.now }
})
MessageSchema.statics = {
    //根据用户的ID来获取未读消息的数量
    getMessagesCount : (id,callback)=>{
        Message.count({"target_id":id,"has_read":false},callback);
    }
}
const Message = mongoose.model('Message',MessageSchema);
module.exports = Message