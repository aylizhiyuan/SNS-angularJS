/**
 * Created by hama on 2017/6/8.
 */
//引入静态
const mapping = require('../static');
const at = require('../common/at');
const validator = require('validator');
const message = require('../common/message');
const Article = require('../model/Article');
const Reply = require('../model/Reply');
const Comment = require('../model/Comment');
const User = require('../model/User');
const markdown = require('../common/markdown');
//二级回复的添加
exports.add = (req,res,next)=>{
    //获取文章的ID
    let article_id = req.params.article_id;
    //获取回复的内容
    let content = validator.trim(String(req.body.comment_content));
    //当前一级回复的ID
    let reply_id = req.body.reply_id;
    //当前你回复谁的用户ID
    let reply_author_id = req.body.reply_author_id;
    Article.getArticle(article_id,(err,article)=>{
        //404页面
        if(typeof article == 'null'){
            return next();
        }
        let comment = new Comment();
        comment.content = content;
        comment.reply_id = reply_id;
        comment.reply_author_id = reply_author_id;
        comment.article_id = article_id;
        comment.author_id = req.session.user._id;
        comment.save().then((comment)=>{
            return comment;
        }).then((comment)=>{
            //给它对应的一级回复的留言量+1
            Reply.getReplyById(comment.reply_id,(err,reply)=>{
                reply.comment_num += 1;
                reply.save();
            })
            return comment;
        }).then((comment)=>{
            //这里要讨论下@的情况，你依然不能@作者
            User.getUsersById([article.author._id,reply_author_id],(err,users)=>{
                //发送at消息
                //文章的作者 | 一级留言的作者 有可能是一个人，也有可能是两个不同的人
                let newContent;
                if(users.length == 1){
                     newContent = content.replace('@' + users[0].name + ' ','');
                }else{
                     newContent = content.replace('@' + users[0].name + ' ','').replace('@' + users[1].name + ' ','')
                }
                at.sendMessageToMentionUsers(newContent,article_id,req.session.user._id,reply_id);
            })
            return comment;
        }).then((comment)=>{
            //二级回复的那个人增加积分、增加回复量，并且保存
            User.getUserById(req.session.user._id,(err,current_user)=>{
                current_user.score += 5;
                current_user.reply_count += 1;
                current_user.save();
                req.session.user = current_user;
            })
            return comment;
        }).then((comment)=>{
            //应该给文章作者发一条消息
            //如果当前登录的用户就是文章的作者，那么留言了不会发送消息
            if(article.author._id.toString() !== req.session.user._id.toString()){
                message.sendReplyMessage(article.author,req.session.user._id,article._id,reply_id);
            }
            return comment;
        }).then((comment)=>{
            //再给回复的那个人发条消息，告诉有人回复它了
            //如果当前登录的用户就是回复的那个人，那么回复了也不会发送消息
            if(reply_author_id.toString() !== req.session.user._id.toString()){
                message.sendCommentMessage(reply_author_id,req.session.user._id,article._id,reply_id);
            }
            return comment;
        }).then((comment)=>{
            Comment.findOne({'_id':comment._id}).populate('author_id').populate('reply_author_id').exec((err,comment)=>{
                comment.content = markdown.markdown(comment.content);
                let date = comment.create_time_ago();
                return res.json({comment:comment,date:date}).end();
            })
        }).catch(err=>{
            return res.end(err);
        })
    })
}
exports.show = (req,res,next)=>{
    //一级回复的ID
    let reply_id = req.params.reply_id;
    //通过一级回复的ID查找到comment表中所对应的所有的二级回复列表，并以分页形式展示
    Comment.getCommentsByReplyId(reply_id,(err,comments)=>{
        if(err){
            res.end(err);
        }
        res.render('comment',{
            comments:comments
        })
    })
}