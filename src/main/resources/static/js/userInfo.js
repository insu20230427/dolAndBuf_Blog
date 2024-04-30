document.addEventListener('DOMContentLoaded', function () {
    userInfo()
})

const tokenForUserInfo = Cookies.get("Authorization");

function userInfo() {
    $.ajax({
        type: "GET",
        url: "/view/users/info",
        headers: {
            'Authorization': tokenForUserInfo
        },
    }).done(function (res) {
        $('#id').val(res.id);
        $('#username').val(res.username);
        if (res.oauth == null) {
            $('#update-email').val(res.email);
        } else {
            $('#btn-oauth2-email').val(res.email);
            $('#oauth2-false').hide();
            $('#oauth2-true').on();
        }
    }).fail(function (error) {
        alert(error.responseJSON.message)
    });
}

$('#btn-user-update').on('click', () => {
    this.updateUser();
});

function updateUser() {
    let data = {
        username: $('#username').val(),
        email: $('#update-email').val(),
        password: $('#update-password').val()
    };
    console.log("data 잘 받아옴 : " + JSON.stringify(data));

    $.ajax({
        type: "PUT",
        url: "/api/users",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        headers: {
            'Authorization': tokenForUserInfo
        }
    }).done(function (res) {
        alert("회원수정이 완료되었습니다.")
        console.log("res : " + JSON.stringify(res))
        location.href = "/";
    }).fail(function (error) {
        const errorMessage = error.responseJSON.message;
        const errors = error.responseJSON.errors;

        $('#update-password').next('span').text('');
        $('#update-email').next('span').text('');

        if (errors) {
            if (errors.password) {
                $('#update-password').next('span').text(errors.password);
                $('#update-password').next('span').css({
                    'color': 'red',
                    'font-size': 'small'
                });
            }
            if (errors.email) {
                $('#update-email').next('span').text(errors.email);
                $('#update-email').next('span').css({
                    'color': 'red',
                    'font-size': 'small'
                });
            }
        }
        console.log("errorMessage : " + errorMessage)
    });
}