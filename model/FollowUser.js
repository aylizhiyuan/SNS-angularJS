/**
 * Created by hama on 2017/5/22.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortid = requrie('shortid');
const FollowUserSchema = new Schema({
    //关注的人
    follow_id:{
        type:String
    },
    //被关注的人
    following_id:{
        type:String
    }
})
const FollowUser = mongoose.model('FollowUser',FollowUserSchema);
module.exports = FollowUser