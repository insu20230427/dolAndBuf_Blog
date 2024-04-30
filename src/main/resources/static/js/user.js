console.log("token test");
const currentTime = new Date();
const expirationTime = new Date(currentTime.getTime() + 60 * 30 * 1000);

let index = {

    init: function () {

        $('#btn-signup').on('click', () => {
            this.signup();
        });

        $('#btn-login').on('click', () => {
            this.login();
        })

        // $('#btn-kakao-login').on('click', () => {
        //     this.kakaoLogin();
        // })

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

        console.log("data 잘 받아옴 : " + JSON.stringify(data));

        // ajax호출시 default가 비동기 호출
        /* 비동기 호출은 페이지 전체를 로드하기 전에, 필요한 정보를 추가 및 업데이트할 수 있게 해줌.
           즉, 화면이 새로고침이 되지 않고 동적으로 바로 화면 상에서 정보가 업데이트 됨. */
        // ajax가 통신을 성공해서 서버가 json으로 리턴해주면 자동으로 js객체로 변환해주므로 굳이 dataType: "json" 명시 안해도 됨.
        $.ajax({
            type: "POST",
            url: "/api/auth/signup",
            data: JSON.stringify(data), // http body data type 명시
            contentType: "application/json; charset=utf-8",
            dataType: "json" // dataType: "json" = 서버의 응답값을 json으로 보낼거니, js객체로 매핑해라라는 형식
        }).done(function (res) { // res 는 json에서 js객체로 변환된 값이 들어옴.
            alert("회원가입이 완료되었습니다.")
            console.log("res : " + JSON.stringify(res))
            location.href = "/";
        }).fail(function (error) {
            const errorMessage = error.responseJSON.message;
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
            console.log(errorMessage)
            // window.location.href = '/view/auth/signupForm';
        });
    }
    ,

// kakaoLogin: function () {
//     window.location.href = "https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=ee8abaaf81bcb4e83dff921f9a492de6&redirect_uri=http://localhost:8080/api/oauth2/kakao/callback";
// },

    login: function () {
        let data = {
            username: $('#username').val(),
            password: $('#password').val(),
        }

        if (!data.username || !data.password) {
            alert("아이디 또는 비밀번호를 모두 입력해주세요.");
            return;
        }

        $.ajax({
            type: "POST",
            url: "/api/auth/login",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function (res, status, xhr) {
            alert("로그인 되었습니다!")

            const accessToken = xhr.getResponseHeader("Authorization");
            Cookies.set('Authorization', decodeURIComponent(accessToken), {expires: expirationTime});

            if (accessToken) {
                const tokenValue = accessToken.split(' ')[1];
                const [, payloadBase64] = tokenValue.split('.');

                try {
                    // Base64 디코딩 후 JSON 파싱
                    const decodedPayload = JSON.parse(atob(payloadBase64)); // payload에서 username과 email 추출

                    // const username = decodedPayload.sub; // 사용자명 추출
                    // const issuedAt = decodedPayload.iat; // 토큰 발급 시간 추출
                    // const expiration = decodedPayload.exp; // 토큰 만료 시간 추출
                    //
                    // console.log('username:', username);
                    // console.log('email:', decodedPayload.email);
                    // console.log('userId:', decodedPayload.userId);
                    //
                    // console.log('issued At:', new Date(issuedAt * 1000));
                    // console.log('expiration:', new Date(expiration * 1000));

                    location.href = "/";
                } catch (error) {
                    console.error('토큰 해석 실패:', error.message);
                }
            } else {
                console.error('토큰이 없습니다.');
            }

            console.log("res : " + JSON.stringify(res))
            // location.href = "/";
        }).fail(function (error) {
            const errorMessage = error.responseJSON.message;
            const errors = error.responseJSON.errors;

            $('#username').next('span').text('');
            $('#password').next('span').text('');
            $('#email').next('span').text('');

            console.log(errorMessage)
            // window.location.href = '/view/auth/signupForm';
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