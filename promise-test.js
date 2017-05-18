/**
 * Created by hama on 2017/5/16.
 */


//感觉多个任务，如果有其中一个任务错了，基本就不会在执行下一个任务了.所以，任务的其他分支感觉没有任何意义和必要性了.
var a = 2;
var promise1 = new Promise(function(reslove,reject){
    if(a == 1){
        reslove('1-1');
    }else{
        reject('2-1');
    }
})
var promise2 = new Promise(function(reslove,reject){
    if(a == 1){
        reslove('1-2');
    }else{
        reject('2-2');
    }
})
promise1.then(function(value){
    console.log(value);
    return promise2;
}).catch(function(value){
    console.log(value);
    return promise2;
}).then(function(value){
    console.log(value);
}).catch(function(value){
    console.log(value);
})