/**
 * Created by hama on 2017/5/12.
 */
//引入静态
const mapping = require('../static');
const formidable = require('formidable');
const gm = require('gm');
const mime = require('../util/mime').types;
const system = require('../util/system');
const SETTING = require('../setting');
const url = require('url');
exports.index = (req,res,next)=>{
    res.render('user-center',{
        title:'个人中心--社区问答系统',
        layout:'indexTemplate',
        resource:mapping.center
    })
}
exports.all = (req,res,next)=>{
    res.render('users',{
        title:'所有的用户--社区问答系统',
        layout:'indexTemplate'
    })
}
exports.setting = (req,res,next)=>{
    //个人设置
    res.render('setting',{
        title:'个人设置--社区问答系统',
        layout:'indexTemplate',
        resource:mapping.setting
    })
}
exports.questions = (req,res,next)=>{
    //用户发布的所有的问题列表
    res.render('question-list',{
        title:'用户发布列表--社区问答系统',
        layout:'indexTemplate',
        resource:mapping.center
    })
}
exports.replys = (req,res,next)=>{
    //用户发布的所有的回复列表
    res.render('reply-list',{
        title:'用户回复列表--社区问答系统',
        layout:'indexTemplate',
        resource:mapping.center
    })
}
exports.upload = (req,res,next)=>{
    //获取传入的参数，如果有的话
    let params = url.parse(req.url,true);
    let form = new formidable.IncomingForm();
    form.uploadDir = 'public/upload/images/';
    let files = [];
    let fields = [];
    let docs = [];
    let updatePath = 'public/upload/images/';
    let smallImgPath = 'public/upload/smallimgs/';
    form.on('field',(field,value)=>{
        fields.push([field,value]);
        console.log(fields);
    }).on('file',(field,file)=>{
        files.push([field,file]);
        docs.push(file);

    })
}