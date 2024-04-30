const validToken = Cookies.get('Authorization');


updateLoginStatus();
function updateLoginStatus() {
    // 토큰 유무에 따라 로그인 상태 업데이트
    if (validToken) {
        $('#login-false').hide();
        $('#login-true').show();
    } else {
        $('#login-true').hide();
        $('#login-false').show();
    }
}

function logout() {
    $.ajax({
        type: "POST",
        url: "/api/users/logout",
        headers: {
            'Authorization': validToken
        },
    }).done(function (res) {
        Cookies.remove('Authorization');
        location.href="/";
    }).fail(function (error) {
        alert(error.responseJSON.message)
    });
}