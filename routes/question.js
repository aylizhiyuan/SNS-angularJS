/**
 * Created by hama on 2017/5/12.
 */
exports.index = (req,res,next)=>{
    res.render('question',{
        title:'问题--社区问答系统',
        layout:'indexTemplate'
    })
}
exports.create = (req,res,next)=>{

}
exports.edit = (req,res,next)=>{

}