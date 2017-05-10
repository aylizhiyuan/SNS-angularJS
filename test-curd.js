/**
 * Created by hama on 2017/5/10.
 */
    //新增
let whiteCat = new cat({name:'whiteCat'});
whiteCat.save().then(result=>{
    res.send(result);
}).catch(err=>{
    res.send(err);
})

//删除
/*let where = {
 "name":"whiteCat"
 }
 cat.remove(where).then(result=>{
 res.send(result);
 }).catch(err=>{
 res.send(err);
 })*/
//修改
/*let update = {name:'blueCat'};
 cat.update({name:'whiteCat'},{$set:update}).then(result=>{
 res.send(result);
 }).catch(err=>{
 res.send(err);
 })*/
//查询
/*cat.find({name:'blueCat'},['name']).then(result=>{
 res.send(result);
 }).catch(err=>{
 res.send(err);
 })*/
/*cat.findOne({name:'blueCat'}).then(result=>{
 res.send(result);
 }).catch(err=>{
 res.send(err);
 })*/