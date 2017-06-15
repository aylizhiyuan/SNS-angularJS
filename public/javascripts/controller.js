/**
 * Created by hama on 2017/5/11.
 */
//注册模块
const registerApp = angular.module('registerApp',[]);
registerApp.controller('registerController',($scope,$http)=>{
    //数据
    $scope.formData = {};
    $scope.error = '';
    $scope.success = '';
    //这是一个表单提交的行为
    $scope.postForm = ()=>{
        $http({
            method:'POST',
            url:'/register',
            data:$.param($scope.formData),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        }).success(data=>{
            if(data == 'success'){
                $scope.success = '注册成功,5秒后跳转,请注意查收邮件';
                $('#successbox').fadeIn();
                setTimeout(function(){
                    window.location.href='/login';
                },5000)
            }else{
                $scope.error = data;
                $('#errorbox').fadeIn();
                setTimeout(function(){
                    $('#errorbox').fadeOut();
                },1000)
            }
        }).error(err=>{
            console.log(err);
        })
    }
})
//登录模块
const loginApp = angular.module('loginApp',[]);
loginApp.controller('loginController',($scope,$http)=>{
    $scope.formData = {};
    $scope.error = '';
    //定义表单的提交行为
    $scope.postForm = ()=>{
        $http({
            method:'POST',
            url:'/login',
            data:$.param($scope.formData),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        }).success(data=>{
            if(data == 'success'){
                window.location.href='/';
            }else{
                $scope.error = data;
                $('#errorbox').fadeIn();
                setTimeout(function(){
                    $('#errorbox').fadeOut();
                },1000)
            }
        }).error(err=>{
            console.log(err);
        })

    }
})
//新建问题模块
var createApp = angular.module('createApp',[]);
createApp.controller('createController',($scope,$http)=>{
    $scope.formData = {};
    $scope.isEmpty = false;
    $scope.error = '';
    var simplemde = new SimpleMDE({
        element: $("#question")[0],
        status:false,
        styleSelectedText:false,
    });
    simplemde.codemirror.on("change", function(){
        if(simplemde.value().trim() == ''){
            $scope.isEmpty = false;
            $scope.$apply('');
        }else{
            $scope.isEmpty = true;
            $scope.$apply('');
        }
    });
    $scope.postForm = ()=>{
        $scope.formData.content = simplemde.value();
        $http({
            method:'POST',
            url:'/question/create',
            data:$.param($scope.formData),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        }).success(data=>{
            if(typeof data === 'object'){
                window.location.href = data.url;
            }else{
                $scope.error = data;
                $('#errorbox').fadeIn();
                setTimeout(function(){
                    $('#errorbox').fadeOut();
                },1000)
            }
        }).error(err=>{
            console.log(err);
        })
    }
})
//消息列表
var messageApp = angular.module('messageApp',[]);
messageApp.controller('messageController',($scope,$http)=>{
    $scope.readOne = (index)=>{
        let messageId = $('.aw-item').eq(index).attr('message_id');
        console.log(messageId);
        $http({
            method:'GET',
            url:'/updateMessage/'+ messageId
        }).success((data)=>{
            if(data == 'success'){
                $('.aw-item').eq(index).fadeOut('slow');
            }else{
                console.log(data);
            }
        }).error((err)=>{
            console.log(err);
        })
    }
    $scope.allRead = ()=>{
        $http({
            method:'GET',
            url:'/updateAllMessage'
        }).success((data)=>{
            if(data == 'success'){
                $('.aw-item').fadeOut('slow');
            }else{
                console.log(data);
            }
        }).error((err)=>{
            console.log(err);
        })
    }
})

//问题的详情
var showApp = angular.module('showApp',[]);
showApp.filter('format',function(){
    return function(date){
        return formatTime(date,true);
    }
})
showApp.filter('to_html',['$sce',function ($sce){
    return function (text) {
        return $sce.trustAsHtml(text);
    }
}])
showApp.controller('showController',($scope,$http)=>{
    //删除操作
    $scope.delete = (event)=>{
        let targetA = $(event.currentTarget);
        let id = targetA.attr('target');
        if(id !== '' && confirm('确定要删除这个问题吗?')){
            $http({
                method:'POST',
                url:`/question/${id}/delete`,
                headers:{'Content-Type':'application/x-www-form-urlencoded'}
            }).success((data)=>{
                if(!data.success){
                    alert(data.message);
                }else{
                    window.location.href = '/';
                }
            }).error((err)=>{
                console.log(err);
            })
        }
    }
    //关注某个文章
    //关注某个人
})
showApp.controller('replyController',($scope,$http)=>{
    //一级回复
    $scope.postForm = ()=>{
        $http({
            method:'POST',
            url:$('#reply_form').attr('target'),
            data:$('#reply_form').serialize(),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        }).success((data)=>{
            if(typeof data == 'object'){
                window.location.reload();
            }else{
                alert(data);
            }
        }).error((err)=>{
            console.log(err);
        })
    }
})
showApp.controller('reply2Controller',($scope,$http)=>{
    $scope.showComment = (event)=>{
        let targetA = $(event.currentTarget);
        let parent = targetA.closest('.aw-item');
        let replyid = parent.attr('id');
        let commentItem = parent.find('.aw-comment-box');
        let editor = commentItem.find('.editor').data('editor');
        //显示
        if(commentItem.css('display') == 'none'){
            $http({
                method:'POST',
                url:`/${replyid}/showComment`,
                headers:{'Content-Type':'application/x-www-form-urlencoded'}
            }).success(function(result){
                parent.find('.aw-comment-list').prepend(result);
                commentItem.fadeToggle('fast');
            }).error(function(err){
                console.log(err);
            })
        }else{
            parent.find('.aw-comment-list').children().not('form').remove();
            commentItem.fadeToggle('fast');
        }
        /*console.log(editor.codemirror);*/
        /*editor.codemirror.setOption('placeholder','试试看吧');*/
    }
    $scope.postForm = (event)=>{
        let targetForm = $(event.currentTarget);
        let parent = targetForm.closest('.aw-item');
        let form = parent.find('form.reply2_form');
        let editor = targetForm.find('.editor').data('editor');
        let content = editor.value();
        let comment_content = content.replace(/^(回复)\s([\u0391-\uFFE5]+[a-zA-Z0-9_]*|[a-zA-Z][a-zA-Z0-9_]{4,11})\s:\s/,'');
        let reply_id = form.find("input[name='reply_id']").val();
        let reply_author_id = form.find("input[name='reply_author_id']").val()
        let data = {
            comment_content,
            reply_id,
            reply_author_id
        };
        $http({
            method:'POST',
            url:targetForm.attr('target'),
            data:$.param(data),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        }).success(function(data){
            //在对应的列表中插入
            if(typeof data === 'object'){
                alert(data.message);
            }else{
                parent.find('.newContent').append(data);
                editor.value('');
            }
        }).error(function(err){
            console.log(err);
        })
    }
})
//编辑文章
var editApp = angular.module('editApp',[]);
editApp.controller('editController',($scope,$http)=>{
    $scope.formData = {
        title:$('input[name=title]').val(),
        category:$('select[name=category]').val()
    };
    $scope.isEmpty = true;
    $scope.error = '';
    var simplemde = new SimpleMDE({
        element: $("#question")[0],
        status:false,
        styleSelectedText:false,
    });
    simplemde.codemirror.on("change", function(){
        if(simplemde.value().trim() == ''){
            $scope.isEmpty = false;
            $scope.$apply('');
        }else{
            $scope.isEmpty = true;
            $scope.$apply('');
        }
    });
    $scope.updateForm = (event)=>{
        let form = $(event.currentTarget);
        let url = form.attr('target');
        $scope.formData.content = simplemde.value();
        $http({
            method:'POST',
            url:url,
            data:$.param($scope.formData),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        }).success((data)=>{
            if(typeof data === 'object'){
                window.location.href = data.url;
            }else{
                $scope.error = data;
                $('#errorbox').fadeIn();
                setTimeout(function(){
                    $('#errorbox').fadeOut();
                },1000)
            }
        }).error((err)=>{
            console.log(err);
        })
    }
})

