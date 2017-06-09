/**
 * Created by hama on 2017/5/24.
 */
const Message = require('../model/Message');
const User = require('../model/User');
const _ = require('lodash');
const message = {
    sendReplyMessage:(targetId,authorId,articleId,replyId,callback)=>{
        callback = callback || _.noop;
        let message = new Message();
        message.type = 'reply';
        message.target_id = targetId;
        message.author_id = authorId;
        message.article_id = articleId;
        message.reply_id = replyId;
        message.save((msg)=>{
            callback(null,msg);
        })
    },
    sendCommentMessage:(targetId,authorId,articleId,replyId,callback)=>{
        callback = callback || _.noop;
        let message = new Message();
        message.type = 'comment';
        message.target_id = targetId;
        message.author_id = authorId;
        message.article_id = articleId;
        message.reply_id = replyId;
        message.save((msg)=>{
            callback(null,msg);
        })
    },
    //发送@消息
    sendAtMessage:(targetId,authorId,articleId,replyId,callback)=>{
        callback = callback || _.noop;
        let message = new Message();
        message.type = 'at';
        message.target_id = targetId;
        message.author_id = authorId;
        message.article_id = articleId;
        message.reply_id = replyId;
        message.save((msg)=>{
            callback(null,msg);
        })
    }
}
module.exports = message