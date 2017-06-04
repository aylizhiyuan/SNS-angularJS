/**
 * Created by hama on 2017/5/10.
 */
//保存登录用户的信息
const mongoose = require('mongoose');
const shortid = require('shortid');
const Schema = mongoose.Schema;
const BaseModel = require('./base_model');
const UserSchema = new Schema({
    //用户的ID
    _id:{
        type:String,
        default:shortid.generate,
        unique:true //id经常会被查询，所以，把ID作为索引
    },
    //用户名
    name:{
        type:String,
        require:true
    },
    //密码
    password:{
        type:String,
        require:true
    },
    //邮箱
    email:{
        type:String
    },
    //个人简介
    motto:{
        type:String,
        default:'这家伙很懒,什么都没有留下..'
    },
    //个人头像
    avatar:{
        type:String,
        default:'/images/default-avatar.jpg'
    },
    //创建时间
    create_time:{
        type:Date,
        default:Date.now
    },
    //更新时间
    update_time:{
        type:Date,
        default:Date.now
    },
    //用户的积分
    score:{
        type:Number,
        default:0
    },
    //发表文章数量
    article_count:{
        type:Number,
        default:0
    },
    //回复的数量
    reply_count:{
        type:Number,
        default:0
    }
    //关注的人和被关注的人待开发...
})
//为这个user表添加静态方法
UserSchema.statics = {
    getUserByName:(name,callback)=>{
        User.findOne({'name':name},callback);
    },
    getUserByEmail:(email,callback)=>{
        User.findOne({'email':email},callback);
    },
    getUserById:(id,callback)=>{
        User.findOne({'_id':id},callback);
    },
    getUsersByNames:(names,callback)=>{
        if(names.length == 0){
            return callback(null,[]);
        }
        User.find({'name':{$in:names}},callback);
    }
}
UserSchema.pre('save', function(next){
    var now = new Date();
    this.update_time = now;
    next();
});
UserSchema.plugin(BaseModel);
const User = mongoose.model('User',UserSchema);
module.exports = User;

