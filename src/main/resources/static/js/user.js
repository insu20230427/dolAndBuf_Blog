let index = {

    init: function () {

        $('#btn-signup').on('click', () => {
            this.signup();
        });

        $('#btn-login').on('click', () => {
            this.login();
        })

        $('#btn-verify-code-byUsername').on('click', () => {
            this.verifyCode();
        })
        $('#btn-send-code-byUsername').on('click', () => {
            this.sendCode();
        });
        $('#send-username').on('click', () => {
            this.sendUsername();
        })

        $('#btn-send-code-byPassword').on('click', () => {
            this.sendCode();
        });
        $('#btn-verify-code-byPassword').on('click', () => {
            this.verifyCode();
        })
        $('#send-tempPassword').on('click', () => {
            this.sendTempPassword();
        })
    },

    signup: function () {

        let data = {
            username: $('#username').val(),
            password: $('#password').val(),
            email: $('#email').val(),
        }

        $.ajax({
            type: "POST",
            url: "/api/auth/signup",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function () {
            swal({
                text: "돌앤벞 블로그에 오신걸 환영합니다. 회원가입이 성공적으로 되었습니다!",
                icon: "success",
            }).then(() => {
                setTimeout(() => {
                    location.href = "/view/auth/loginForm";
                }, 50);
            });
        }).fail(function (error) {
            const errors = error.responseJSON.errors;

            $('#username').next('span').text('');
            $('#password').next('span').text('');
            $('#email').next('span').text('');

            if (errors) {
                if (errors.username) {
                    $('#username').next('span').text(errors.username);
                    $('#username').next('span').css({
                        'color': 'red',
                        'font-size': 'small'
                    });
                }
                if (errors.password) {
                    $('#password').next('span').text(errors.password);
                    $('#password').next('span').css({
                        'color': 'red',
                        'font-size': 'small'
                    });
                }
                if (errors.email) {
                    $('#email').next('span').text(errors.email);
                    $('#email').next('span').css({
                        'color': 'red',
                        'font-size': 'small'
                    });
                }
            }
        });
    },

    login: function () {
        let data = {
            username: $('#username').val(),
            password: $('#password').val(),
        }

        if (!data.username || !data.password) {
            swal({
                text: "아이디 또는 비밀번호를 모두 입력해주세요.",
                icon: "warning",
            });
            return;
        }

        $.ajax({
            type: "POST",
            url: "/api/auth/login",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function () {
            swal({
                text: "환영합니다. 로그인이 성공적으로 되었습니다!",
                icon: "success",
            }).then(() => {
                setTimeout(() => {
                    location.href = "/";
                }, 50);
            });
        }).fail(function (error) {
            const errorMessage = error.responseJSON.message;

            $('#username').next('span').text('');
            $('#password').next('span').text('');
            $('#email').next('span').text('');

            swal({
                text: "로그인 요청이 실패했습니다. 다시 로그인을 요청해주세요!",
                icon: "error",
            });

            console.log(errorMessage)
        });
    },


    sendCode: function () {
        const email = $('#email').val();

        $.ajax({
            type: "POST",
            url: '/api/auth/send-mail/code?' + $.param({email: email})
        }).done(function (res) {
            console.log(res)
            $('#span-code').text("인증코드가 전송됐습니다. 인증코드를 확인하신 후, 인증해주세요.");
            $('#span-code').css({
                'color': 'green',
                'font-size': 'small'
            });
        }).fail(function (error) {
            console.log(error)
            $('#span-code').text("인증코드를 전송 실패했습니다. 다시 시도해주세요.");
            $('#span-code').css({
                'color': 'red',
                'font-size': 'small'
            });
        });
    },

    verifyCode: function () {
        const code = $('#code').val();

        $.ajax({
            type: "POST",
            url: '/api/auth/send-mail/code/verify?' + $.param({code: code})
        }).done(function (res) {
            console.log(res)
            $('#span-verify').text("인증이 완료 되었습니다. 아이디를 찾으실려면 아래 링크를 클릭해주세요.");
            $('#span-verify').css({
                'color': 'green',
                'font-size': 'small'
            });
        }).fail(function (error) {
            console.log(error)
            $('#span-verify').text("인증이 실패했습니다. 다시 시도해주세요.");
            $('#span-verify').css({
                'color': 'red',
                'font-size': 'small'
            });
        });
    },

    sendUsername: function () {
        const email = $('#email').val();

        $.ajax({
            type: "POST",
            url: '/api/auth/send-mail/username?' + $.param({email: email})
        }).done(function (res) {
            console.log(res)
        }).fail(function (error) {
            console.log(error)
        });
    },

    sendTempPassword: function () {
        const email = $('#email').val();

        $.ajax({
            type: "POST",
            url: '/api/auth/send-mail/password?' + $.param({email: email})
        }).done(function (res) {
            console.log(res)
        }).fail(function (error) {
            console.log(error)
        });
    }
}
index.init();