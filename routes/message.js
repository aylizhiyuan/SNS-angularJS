/**
 * Created by hama on 2017/5/12.
 */
//引入静态
const mapping = require('../static');
const Message = require('../model/Message');
exports.index = (req,res,next)=>{
    //获取所有的消息以分页的形式

    res.render('message-list',{
        title:'消息列表--社区问答系统',
        layout:'indexTemplate',
        resource:mapping.center
    })
}