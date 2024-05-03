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
        $('#userId').val(res.id);

        const trimmedUsername = $('#username').text().replace('작성자 : ', '');
        console.log(res.username);
        console.log(trimmedUsername)
        if (trimmedUsername == res.username) {
            $('#btn-post-delete').show();
            $('#btn-post-edit').show();
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
        swal({
            text: error.responseJSON.message,
            icon: "error"
        })
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
        }).done(function () {
            swal({
                text: "게시글이 작성되었습니다!",
                icon: "success",
            }).then(() => {
                // 2초 후에 페이지를 이동합니다.
                setTimeout(() => {
                    location.href = "/";
                }, 50);
            });
        }).fail(function () {
            swal({
                text: "게시글 작성을 실패했습니다. 다시 작성해주세요!",
                icon: "error",
            })
        });
    },

    deletePost: function () {
        let id = $("#id").text(); // id값이 id인 input태그의 text값을 가져온다
        console.log("id : " + id)

        $.ajax({
            type: "DELETE",
            url: "/api/posts/" + id,
            dataType: "json",
        }).done(function () {
            swal({
                text: "게시글이 삭제가 완료되었습니다!",
                icon: "success",
            }).then(() => {
                // 2초 후에 페이지를 이동합니다.
                setTimeout(() => {
                    location.href = "/";
                }, 50);
            });
        }).fail(function (error) {
            swal({
                text: "게시글 삭제를 실패했습니다. 다시 작성해주세요!",
                icon: "error",
            })
            console.log("error : " + JSON.stringify(error));
        });
    },

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
        }).done(function () {
            swal({
                text: "게시글 수정을 성공했습니다!",
                icon: "success",
            }).then(() => {
                // 2초 후에 페이지를 이동합니다.
                setTimeout(() => {
                    location.href = "/";
                }, 50);
            });
        }).fail(function (error) {
            swal({
                text: "게시글 수정을 실패했습니다. 다시 이용 부탁드립니다.",
                icon: "error",
            })
            console.log("error : " + JSON.stringify(error));
        });
    },

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
            swal({
                text: "좋아요 실패. 좋아요를 다시 시도해주세요.",
                icon: "error",
            })
            console.log("error : " + error)
        });
    },

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
            swal({
                text: "좋아요 삭제 실패. 좋아요 삭제를 다시 시도해주세요.",
                icon: "warning",
            })
            console.log("error : " + error)
        });
    }
}
indexPost.init();