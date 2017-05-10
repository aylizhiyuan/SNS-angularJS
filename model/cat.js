/**
 * Created by hama on 2017/5/10.
 */
const mongoose = require('mongoose');
const shortid = require('shortid');
const Schema = mongoose.Schema;
//然后进行实例化
const catSchema = new Schema({
    //在这里面，我们可以对这个模型的数据类型进行设置
    _id:{
        type:String,
        default:shortid.generate
    },
    name:String
})
const Cat = mongoose.model('cat',catSchema);
module.exports = Cat;
