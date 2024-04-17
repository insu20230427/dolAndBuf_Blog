let index = {
    init: function () {
        $('#btn-signup').on('click', () => {
            this.signup();
        });
        $('#btn-user-update').on('click', () => {
            this.updateUser();
        });
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
        }).done(function (res) { // res는 json에서 js객체로 변환된 값이 들어옴.
            alert("회원가입이 완료되었습니다.")
            console.log("res : " + JSON.stringify(res))
            location.href = "/";
        }).fail(function (error) {
            alert(JSON.stringify(error))  // error도 js객체로 받아오므로, JSON으로 바꿔서 alert 출력해보기.
        });
    },

    updateUser: function () {

        let data = {
            id: $('#id').val(),
            username: $('#username').val(),
            password: $('#password').val(),
            email: $('#email').val()
        }

        console.log("data 잘 받아옴 : " + JSON.stringify(data));

        $.ajax({
            type: "PUT",
            url: "/api/users",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function (res) {
            alert("회원수정이 완료되었습니다.")
            console.log("res : " + JSON.stringify(res))
            location.href = "/";
        }).fail(function (error) {
            alert(JSON.stringify(error))
        });
    }
}
index.init();