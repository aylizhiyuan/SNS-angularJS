/**
 * Created by hama on 2017/5/9.
 */
const mongoose = require('mongoose');
//创建模型
const kittySchema = mongoose.Schema({
    name:String //定义字段
})
var kitten = mongoose.model('kitten',kittySchema);//创建了一个集合
module.exports = kitten


