/**
 * Created by hama on 2017/5/9.
 */
const mongoose = require('mongoose');
const setting = require('../setting');
//nodeJS加密模块
const crypto = require('crypto');
const url = require('url');
const Article = require('../model/Article');
//这句话说明我们使用的promise对象是ES6中原生的promise对象.
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${setting.host}/${setting.db}`);
const DbSet = {
    //新增操作
    addOne:(obj,req,res,logMsg)=>{
        let newObj = new obj(req.body);
        newObj.save().then(result=>{
            res.end(logMsg);
        }).catch(err=>{
            res.end(err);
        })
    },
    //删除
    delOne:(obj,req,res,logMsg)=>{
        let params = url.parse(req.url,true);
        let targetId = params.query.id;
        obj.remove({_id:targetId}).then(result=>{
            res.end(logMsg);
        }).catch(err=>{
            res.end(err);
        })
    },
    //修改
    updateOne:(obj,req,res,logMsg)=>{
        let params = url.parse(req.url,true);
        let targetId = params.query.id;
        req.body.updateDate = new Date();
        let update = {$set:req.body};
        obj.update({_id:targetId},update).then(result=>{
            res.end(logMsg);
        }).catch(err=>{
            res.end(err);
        })
    },
    //查询
    findOne:(obj,req,res,logMsg)=>{
        let params = url.parse(req.url,true);
        let targetId = params.query.id;
        obj.findOne({_id:targetId}).then(result=>{
            res.json(result);
        }).catch(err=>{
            res.end(err);
        })
    },
    //查询所有的
    findAll:(obj,req,res,logMsg)=>{
        obj.find({}).then(result=>{
            res.json(result);
        }).catch(err=>{
            res.end(err);
        })
    },
    //加密
    encrypt : function(data,key){ // 密码加密
        var cipher = crypto.createCipher("bf",key);
        var newPsd = "";
        newPsd += cipher.update(data,"utf8","hex");
        newPsd += cipher.final("hex");
        return newPsd;
    },
    decrypt : function(data,key){ //密码解密
        var decipher = crypto.createDecipher("bf",key);
        var oldPsd = "";
        oldPsd += decipher.update(data,"hex","utf8");
        oldPsd += decipher.final("utf8");
        return oldPsd;
    },
    //分页查询
    pagination:function (obj,req,res) {
        var params = url.parse(req.url,true);
        var currentPage = Number(params.query.currentPage) || 1;
        var limit = Number(params.query.limit) || 20;
        var startNum = (currentPage - 1) * limit;
        var pageInfo;
        if(obj === Article){
            var query = obj.find({}).sort({last_reply_time:'-1',create_time:'-1'}).populate('author').populate('last_reply').skip(startNum).limit(limit);
        }
        query.exec(function(err,docs){
            if(err){
                console.log(err);
            }else{
                pageInfo = {
                    "totalItems":docs.length,
                    "currentPage":currentPage,
                    "limit":limit,
                    "startNum":Number(startNum)
                };
                return res.json({
                    docs : docs,
                    pageInfo : pageInfo
                })
            }
        })
    }
}
module.exports = DbSet