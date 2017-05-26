/**
 * Created by hama on 2017/5/12.
 */
//引入静态
const mapping = require('../static');
const Message = require('../model/Message');
exports.index = (req,res,next)=>{
    //获取所有的已读消息和未读消息
    //这里这种写法让我很无语，真的.
    Message.getUnreadMessage(req.session.user._id,(err,dataList)=>{
        let notReadMessage = dataList;
        Message.getReadMessage(req.session.user._id,(err,dataList)=>{
            let readMessage = dataList;
            res.render('message-list',{
                title:'消息列表--社区问答系统',
                layout:'indexTemplate',
                resource:mapping.center,
                read:readMessage,
                not_read:notReadMessage
            })
        })

    })
}
exports.updateMessage = (req,res,next)=>{
    let id = req.params.id;
    Message.updateMessage(id,(err,result)=>{
        if(err){
            res.end(err);
        }
        res.end('success');
    })
}
exports.updateAllMessage = (req,res,next)=>{
    var user_id = req.session.user._id;
    Message.updateAllMessage(user_id,(err,result)=>{
        if(err){
            res.end(err);
        }
        res.end('success');
    })
}