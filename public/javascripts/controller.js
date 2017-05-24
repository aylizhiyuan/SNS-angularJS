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
        if(simplemde.value() == ''){
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
