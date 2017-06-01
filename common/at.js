/**
 * Created by hama on 2017/5/24.
 */
const User = require('../model/User');
const _ = require('lodash');
const message = require('./message');
const  at = {
    //从发布文章的内容中提取出@username标记的用户名数组
    fetchUsers :text=>{
        if(!text){
            return [];
        }
        let ignoreRegexs = [
            /```.+?```/g, // 去除单行的 ```
            /^```[\s\S]+?^```/gm, // ``` 里面的是 pre 标签内容
            /`[\s\S]+?`/g, // 同一行中，`some code` 中内容也不该被解析
            /^    .*/gm, // 4个空格也是 pre 标签，在这里 . 不会匹配换行
            /\b\S*?@[^\s]*?\..+?\b/g, // somebody@gmail.com 会被去除
            /\[@.+?\]\(\/.+?\)/g, // 已经被 link 的 username
        ]
        ignoreRegexs.forEach(function (ignore_regex) {
            text = text.replace(ignore_regex, '');
        });
        let results = text.match(/@[a-z0-9\-_]+\b/igm);
        let names = [];
        if(results){
            for (let i = 0, l = results.length; i < l; i++) {
                let s = results[i];
                //remove leading char @
                s = s.slice(1);
                names.push(s);
            }
        }
        names = _.uniq(names);
        return names;
    },
    //根据文本内容读取用户，并发送消息给提到的用户
    sendMessageToMentionUsers:(text,articleId,authorId,replyId,callback)=>{
        if(typeof replyId === 'function'){
            callback = replyId;
            replyId = null;
        }
        callback = callback || _.noop;
        User.getUsersByNames(at.fetchUsers(text),(err,users)=>{
            if(err||!users){
                return callback(err);
            }
            users = users.filter((user)=>{
                return user._id !== authorId;
            });
            users.forEach((user)=>{
                message.sendAtMessage(user._id,authorId,articleId,replyId,(err,msg)=>{
                    //这里面暂时还不知道要不要传入msg这个信息,感觉应该不需要,callback里面可能
                    //只需要处理下错误就可以了.
                    callback();
                    //这里每次都会执行多次，暂时先留着解决吧....
                })
            })
        })
    },
    linkUsers:(text,callback)=>{
        let users = at.fetchUsers(text);
        for(let i=0,l=users.length;i<l;i++){
            let name = users[i];
            text = text.replace(new RegExp('@' + name + '\\b(?!\\])', 'g'), '[@' + name + '](/user/' + name + ')')
        }
        if (!callback) {
            return text;
        }
        return callback(null, text);
    }
}
module.exports = at;