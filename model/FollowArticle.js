/**
 * Created by hama on 2017/5/22.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortid = requrie('shortid');
const FollowArticleSchema = new Schema({
    //哪个人
    user_id:{
        type:String
    },
    //关注了哪个话题
    article_id:{
        type:String
    }
})
const FollowArticle = mongoose.model('FollowArticle',FollowArticleSchema);
module.exports = FollowArticle