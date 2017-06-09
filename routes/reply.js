/**
 * Created by hama on 2017/6/2.
 */
//引入静态
const mapping = require('../static');
const validator = require('validator');
const Article = require('../model/Article');
const Reply = require('../model/Reply');
const User = require('../model/User');
const at = require('../common/at');
const message = require('../common/message');
exports.add = (req,res,next)=>{
    let content = req.body.reply_content;
    let article_id = req.params.article_id;
    let reply_id = req.body.reply_id;
    let str = validator.trim(String(content));
    if(str === ''){
        return res.end('内容不能为空');
    }
    Article.getArticle(article_id,(err,article)=>{
        //404页面
        if(typeof article == 'null'){
            return next();
        }
        let reply = new Reply();
        reply.content = content;
        reply.article_id = article_id;
        reply.author = req.session.user._id;
        if(reply_id){
            reply.reply_id = reply_id;
            //如果它是二级回复，可以在这里进行操作
        }
        reply.save().then((reply)=>{
            //获取到留言的这篇文章的信息之后，将留言保存在Reply表中
            return reply;
        }).then((reply)=>{
            //然后更新文章最后回复的信息
            Article.findOne({'_id':reply.article_id}).then((article)=>{
                article.last_reply = reply._id;
                article.last_reply_time = new Date();
                article.comment_num += 1;
                article.save();
            })
            return reply;
        }).then((reply)=>{
            //防止重复@作者的情况
            //如果你已经回复了作者，只用发送回复消息即可，不用发布@消息
            User.getUserById(article.author,(err,article_author)=>{
                //发送at消息
                let newContent = content.replace('@' + article_author.name + ' ','');
                at.sendMessageToMentionUsers(newContent,article_id,req.session.user._id,reply._id);
            })
            return reply;
        }).then(reply=>{
            //给这个留言的用户加积分,回复数量
            User.getUserById(req.session.user._id,(err,current_user)=>{
                current_user.score += 5;
                current_user.reply_count += 1;
                current_user.save();
                req.session.user = current_user;
            })
            return reply;
        }).then(reply=>{
            //你给某个人留言了，给它发消息
            //但是给自己留言不会
            if(article.author._id.toString() !== req.session.user._id.toString()){
                message.sendReplyMessage(article.author,req.session.user._id,article._id,reply._id);
            }
            return reply;
        }).then(reply=>{
            return res.json({'path':article._id,'locat':reply._id});
        }).catch(err=>{
            return res.end(err);
        })
    })
}