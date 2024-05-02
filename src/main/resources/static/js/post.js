const tokenByPost = Cookies.get('Authorization');

console.log(tokenByPost)

document.addEventListener('DOMContentLoaded', function () {
    userInfo()
})

function userInfo() {
    $.ajax({
        type: "GET",
        url: "/view/users/info",
        headers: {
            'Authorization': tokenByPost
        },
    }).done(function (res) {
        const trimmedUsername = $('#username').text().replace('작성자 : ', '');
        console.log(res.username);
        console.log(trimmedUsername)
        if (trimmedUsername !== res.username) {
            $('#btn-post-delete').hide();
            $('#btn-post-edit').hide();
        }

        let id = $("#id").text();
        let userId = res.id;
        let liked = localStorage.getItem('post_' + id + '_liked' + userId);
        if (liked === 'true') {
            $("#btn-post-like").hide();
            $("#btn-post-like-delete").show();
        } else {
            $("#btn-post-like-delete").hide();
            $("#btn-post-like").show();
        }

    }).fail(function (error) {
        alert(error.responseJSON.message)
    });
}

let indexPost = {
    init: function () {
        $('#btn-post-write').on('click', () => {
            this.writePost();
        });
        $('#btn-post-delete').on('click', () => {
            this.deletePost();
        });
        $('#btn-post-update').on('click', () => {
            this.updatePost();
        });
        $('#btn-post-like').on('click', () => {
            this.addLikePost();
        })
        $('#btn-post-like-delete').on('click', () => {
            this.deleteLikePost();
        })
    },


    writePost: function () {
        let data = {
            title: $('#title').val(),
            content: $('#content').val(),
        }

        $.ajax({
            type: "POST",
            url: "/api/posts",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                'Authorization': tokenByPost
            }
        }).done(function (res) {
            alert("글쓰기가 완료되었습니다.")
            console.log("res : " + JSON.stringify(res))
            location.href = "/";
        }).fail(function (error) {
            alert(JSON.stringify(error))
        });
    }
    ,

    deletePost: function () {
        let id = $("#id").text(); // id값이 id인 input태그의 text값을 가져온다
        console.log("id : " + id)

        $.ajax({
            type: "DELETE",
            url: "/api/posts/" + id,
            dataType: "json",
            // headers: {
            //     'Authorization': tokenByPost
            // }
        }).done(function (res) {
            alert("삭제가 완료되었습니다.")
            console.log("res : " + JSON.stringify(res))
            location.href = "/";
        }).fail(function (error) {
            console.log(JSON.stringify(error))
            alert(JSON.stringify(error));
        });
    }
    ,

    updatePost: function () {
        let id = $('#id').val(); // id값이 id인 input태그의 value값을 가져온다.

        let data = {
            title: $('#title').val(),
            content: $('#content').val(),
        }

        $.ajax({
            type: "PUT",
            url: "/api/posts/" + id,
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            // headers: {
            //     'Authorization': tokenByPost
            // }
        }).done(function (res) {
            alert("글 수정이 완료되었습니다.")
            console.log("res : " + JSON.stringify(res))
            location.href = "/";
        }).fail(function (error) {
            console.log("error : " + JSON.stringify(error));
        });
    }
    ,

    addLikePost: function () {
        let id = $("#id").text();

        $.ajax({
            type: "POST",
            url: "/api/posts/likes/" + id,
            headers: {
                'Authorization': tokenByPost
            }
        }).done(function (res) {
            const userId = res.data;
            console.log(res)
            localStorage.setItem('post_' + id + '_liked' + userId, true);
            location.href = `/view/posts/${id}/detailForm`;
        }).fail(function (error) {
            console.log(error)
        });
    }
    ,

    deleteLikePost: function () {
        let id = $("#id").text();

        $.ajax({
            type: "DELETE",
            url: "/api/posts/likes/" + id,
            headers: {
                'Authorization': tokenByPost
            }
        }).done(function (res) {
            const userId = res.data;
            console.log(res)
            localStorage.setItem('post_' + id + '_liked' + userId, false);
            location.href = `/view/posts/${id}/detailForm`;
        }).fail(function (error) {
            console.log(error)
        });
    }
}
indexPost.init();