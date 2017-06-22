/**
 * Created by hama on 2017/5/12.
 */
//引入静态
const mapping = require('../static');
const formidable = require('formidable');
const validator = require('validator');
const gm = require('gm');
const mime = require('../util/mime').types;
const system = require('../util/system');
const SETTING = require('../setting');
const url = require('url');
const moment = require('moment');
const fs = require('fs');
const User = require('../model/User');
const Article = require('../model/Article');
const Reply = require('../model/Reply');
exports.index = (req,res,next)=>{
    //得到用户的姓名
    let name = req.params.name;
    //根据用户的姓名，查到用户所对应的信息
    User.getUserByName(name,(err,user)=>{
        if(!user){
            return res.render('error',{
                error:'',
                message:'该用户不存在'
            })
        }else{
            let query = {author:user._id};
            let opt = {limit:5,sort:'-create_time'};
            //1.这个用户发布的文章  Article表
            Article.getArticleByQuery(query,opt,(err,articles)=>{
                if(err){
                    return res.render('error',{error:err,message:''});
                }
                //2.这个用户回复过的问题 Reply表
                Reply.getRepliesByAuthorId(user._id,{limit:5,sort:'-create_time'},(err,replies)=>{
                    return res.render('user-center',{
                        title:'个人中心--社区问答系统',
                        layout:'indexTemplate',
                        resource:mapping.center,
                        userInfo:user,
                        articles:articles,
                        replies:replies
                    })
                })
            })
        }
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
    let name = req.params.name;
    User.getUserByName(name,(err,user)=>{
        if(!user){
            return res.render('error',{
                error:'',
                message:'该用户不存在'
            })
        }else{
            let query = {author:user._id};
            let opt = {sort:'-create_time'};
            Article.getArticleByQuery(query,opt,(err,articles)=>{
                if(err){
                    return res.render('error',{error:err,message:''});
                }
                res.render('question-list',{
                    title:'用户发布列表--社区问答系统',
                    layout:'indexTemplate',
                    resource:mapping.center,
                    userInfo:user,
                    articles:articles
                })
            })
        }
    })
}
exports.replys = (req,res,next)=>{
    //得到用户的姓名
    let name = req.params.name;
    //根据用户的姓名，查到用户所对应的信息
    User.getUserByName(name,(err,user)=>{
        if(!user){
            return res.render('error',{
                error:'',
                message:'该用户不存在'
            })
        }else{
            //2.这个用户回复过的问题 Reply表
            Reply.getRepliesByAuthorId(user._id,{sort:'-create_time'},(err,replies)=>{
                return res.render('reply-list',{
                    title:'个人中心--社区问答系统',
                    layout:'indexTemplate',
                    resource:mapping.center,
                    userInfo:user,
                    replies:replies
                })
            })
        }
    })
}
exports.upload = (req,res,next)=>{
    //获取传入的参数
    var params = url.parse(req.url,true);
    var fileType = params.query.type;
    var fileKey = params.query.key;
    // 初始化
    var form = new formidable.IncomingForm();
    // 设置它的上传地址
    form.uploadDir = 'public/upload/images/';
    var files = [];
    var fields = [];
    var docs = [];
    var updatePath = "public/upload/images/";
    var smallImgPath = "public/upload/smallimgs/";
    //如果从表单那里接收到的是key/value这种数据的话
    //将数据放到fields数组里面.
    form.on('field',function(field,value){
        fields.push([field,value]);
    }).on('file',function(field,file){
        //如果接受到的是文件的话
        files.push([field,file]);
        docs.push(file);
        //校验文件的合法性
        var realFileType = system.getFileMimeType(file.path);
        var contentType  = mime[realFileType.fileType] || 'unknown';
        if(contentType == 'unknown'){
            res.end('typeError');
        }

        var typeKey = "others";
        var thisType = file.name.split('.')[1];
        var date = new Date();
        var ms = moment(date).format('YYYYMMDDHHmmss').toString();

        if(fileType == 'images'){
            typeKey = "img"
        }
        newFileName = typeKey + ms + "." + thisType;

        if(fileType == 'images'){
            if(realFileType.fileType == 'jpg' || realFileType.fileType == 'jpeg' || realFileType.fileType == 'png'  || realFileType.fileType == 'gif'){
                if(SETTING.imgZip){
                    fs.rename(file.path,updatePath + newFileName,function(err){
                        if(err){
                            console.log(err)
                        }else{
                            // 图片缩放
                            var input = updatePath + newFileName;
                            var out = smallImgPath + newFileName;
                            if(fileKey == 'userlogo'){ // 用户头像
                                gm(input).resize(100,100,'!').autoOrient().write(out, function (err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log('done');
                                        //压缩后再返回，否则的话，压缩会放在后边，导致链接失效
                                        return res.end('/upload/smallimgs/' + newFileName);
                                    }
                                });
                            }
                        }
                    })
                }else{
                    fs.rename(file.path,updatePath + newFileName,function(err){
                        if(err){
                            console.log(err)
                        }
                        return res.end('/upload/images/' + newFileName);
                    })
                }
            }else{
                res.end('typeError');
            }
        }
    })
    //该方法会转换请求中所包含的表单数据，callback会包含所有字段域和文件信息
    form.parse(req, function(err, fields, files) {
        err && console.log('formidabel error : ' + err);
        console.log('parsing done');
    });
}
exports.updateUser = (req,res,next)=>{
    let id = req.params.id;
    let motto = req.body.motto;
    let avatar = req.body.avatar;
    let error;
    //数据验证
    if(!validator.isLength(motto,0)){
        error = '个性签名不能为空';
    }
    if(!validator.isLength(avatar,0)){
        error = '个人头像上传失败啦';
    }
    if(error){
        return res.end(error);
    }else{
        User.getUserById(id,(err,user)=>{
            if(err){
                return res.end(err);
            }
            if(!user){
                return res.end('该用户不存在');
            }
            user.update_time = new Date();
            user.motto = motto;
            user.avatar = avatar;
            user.save().then((user)=>{
                req.session.user = user;
                return res.end('success');
            }).catch(err=>{
                return res.end(err);
            })
        })
    }
}