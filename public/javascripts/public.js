/**
 * Created by hama on 2017/5/11.
 */
//分页的点击事件
$(document).on('click','a.loadpage',function(event){
    var targetA = $(event.target);
    //要更新的内容
    var parent = targetA.closest('.aw-item');
    var id = parent.attr('id');
    var commentItem = parent.find('.aw-comment-list');
    //要传递的页数
    var page = targetA.text();
    var url = `/${id}/showComment`;
    $.ajax({
        type:'POST',
        url:`${url}?page=${page}`
    }).done(function(result){
        commentItem.children().not('form').remove();
        commentItem.prepend(result);
    }).fail(function(err){
        console.log(err);
    });
})
//二级回复的点击事件
$(document).on('click','.comment_btn',function(event){
    var targetBtn = $(event.target);
    var parent = targetBtn.closest('.aw-item');
    var reply_id = parent.attr('id');
    var form = parent.find('form');
    var commentItem = targetBtn.closest('.comment-item');
    var targetName = commentItem.attr('target');
    var targetId = commentItem.attr('id');
    var editor = parent.find('textarea.reply_editor').data('editor');
    if(window.location.hash == ''){
        window.location.hash = `#${reply_id}-form`;
    }else{
        window.location.hash = '';
        window.location.hash = `#${reply_id}-form`;
    }
    editor.value(`回复 ${targetName} : `);
    editor.codemirror.on('change',function(){
        if(editor.value() == ''){
            form.find("input[name='reply_author_id']").val('');
        }
    })
    form.find("input[name='reply_author_id']").val(targetId);
})

