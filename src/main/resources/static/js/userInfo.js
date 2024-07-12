document.addEventListener('DOMContentLoaded', function () {
    userInfo()
})

const token = Cookies.get("Authorization");

function userInfo() {
    $.ajax({
        type: "GET",
        url: "/view/users/info",
        headers: {
            'Authorization': token
        },
    }).done(function (res) {
        $('#id').val(res.id);
        $('#username').val(res.username);
        if (res.oauth == null) {
            $('#oauth2-false').show();
            $('#update-email').val(res.email);
        } else {
            $('#btn-oauth2-email').val(res.email);
            $('#oauth2-false').hide();
            $('#oauth2-true').show();
        }
    }).fail(function (error) {
        console.log(error.responseJSON.message)
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

    $.ajax({
        type: "PUT",
        url: "/api/users",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        headers: {
            'Authorization': token
        }
    }).done(function (res) {
        swal({
            text: "회원 수정이 완료 되었습니다.!", icon: "success",
        }).then(() => {
            setTimeout(() => {
                location.href = "/";
            }, 50);
        });
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