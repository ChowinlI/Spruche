(function ($) {
    var $email = $('#email'),
        $password = $('#password'),
        $remember = $('#remember'),
        $btn = $('#sure_btn');

    $btn.bind('click', function () {
        if ($email.val() == '' || $password.val() == '') {
            myAlert('请输入用户名和密码');
            return false;
        }
        if(!isEmail($email.val())) {
            myAlert('邮箱格式不正确');
            return false;
        }
        if (!isPassword($password.val())) {
            myAlert('密码只能输入6-20个字母、数字、特殊字符');
            return false;
        }
        const form = {
            "email": $email.val(),
            "password": $password.val(),
            "remeber": $remember.is(':checked')
        };
        $.ajax({
            type: 'POST',
            url: '/ulogin',
            dataType: 'json',
            traditional: true,
            data: {
                form: JSON.stringify(form)
            },
            success: function (data) {
                switch (data.type) {
                    case 0:
                        successLogin(data.user);
                        break;
                    case 1:
                        myAlert('用户名或密码错误');  
                        clearForm();                        
                        break;
                    case 2:
                        myAlert('你是机器人吗？');
                        clearForm();
                        break;
                }
                 
            },
            error: function (xhr, errorType, error) {
                myAlert('网络繁忙，请稍后再试...');
            }
        });
        return false;
    });

    //清空表单
    function clearForm(){
        $email.val('');
        $password.val('');
    }

    //密码验证
    function isPassword(str) {
        var patrn = /^(\w|@|#|\$|%|\^|&|\*){6,20}$/;
        if (!patrn.exec(str)) return false;
        return true;
    }

    // 邮箱验证
    function isEmail(str) {
        var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if(!myreg.test(str)) return false;
        return true;
    }
    
    //成功登陆
    function successLogin(user) {
        console.log(user.expires);
        var save = false;
        if($remember.is(':checked')){
            save = true;
        }
        if(save){
            $.cookie('uid',user.id, { expires: new Date(user.expires), path: "/"});
            $.cookie('username', user.username, { expires: new Date(user.expires), path: "/"});
            $.cookie('type',user.type, { expires: new Date(user.expires), path: "/"});
            $.cookie('token',user.token, { expires: new Date(user.expires), path: "/" });
        }
        else{
            $.cookie('uid',user.id, {path: "/"});
            $.cookie('username', user.username, { path: "/"});
            $.cookie('type',user.type, {path: "/"});
            $.cookie('token',user.token, { path: "/" })
        }
        window.location.href="/admin#index";
    }

    closeAlert();
})(jQuery);