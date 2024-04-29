const token = localStorage.getItem("accessToken");
const currentTime = new Date();
const expirationTime = new Date(currentTime.getTime() + 60 * 30 * 1000);

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

        let id = $("#id").text();
        let liked = localStorage.getItem('post_' + id + '_liked');
        if (liked === 'true') {
            $("#btn-post-like").hide();
            $("#btn-post-like-delete").show();
        } else {
            $("#btn-post-like-delete").hide();
            $("#btn-post-like").show();
        }
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
                'Authorization': token
            }
        }).done(function (res) {
            alert("글쓰기가 완료되었습니다.")
            console.log("res : " + JSON.stringify(res))
            location.href = "/";
        }).fail(function (error) {
            alert(JSON.stringify(error))
        });
    },

    deletePost: function () {
        let id = $("#id").text(); // id값이 id인 input태그의 text값을 가져온다
        console.log("id : " + id)

        $.ajax({
            type: "DELETE",
            url: "/api/posts/" + id,
            dataType: "json",
            headers: {
                'Authorization': token
            }
        }).done(function (res) {
            alert("삭제가 완료되었습니다.")
            console.log("res : " + JSON.stringify(res))
            location.href = "/";
        }).fail(function (error) {
            console.log(JSON.stringify(error))
            alert(JSON.stringify(error));
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
            headers: {
                'Authorization': token
            }
        }).done(function (res) {
            alert("글 수정이 완료되었습니다.")
            console.log("res : " + JSON.stringify(res))
            location.href = "/";
        }).fail(function (error) {
            console.log("error : " + JSON.stringify(error));
        });
    },

    addLikePost: function () {
        let id = $("#id").text();

        $.ajax({
            type: "POST",
            url: "/api/posts/likes/" + id,
            headers: {
                'Authorization': token
            }
        }).done(function (res) {
            localStorage.setItem('post_' + id + '_liked', true);
            location.href = `/view/posts/${id}/detailForm`;
        }).fail(function (error) {
            console.log(error)
        });
    },

    deleteLikePost: function () {
        let id = $("#id").text();

        $.ajax({
            type: "DELETE",
            url: "/api/posts/likes/" + id,
            headers: {
                'Authorization': token
            }
        }).done(function (res) {
            localStorage.setItem('post_' + id + '_liked', false);
            location.href = `/view/posts/${id}/detailForm`;
        }).fail(function (error) {
            console.log(error)
        });
    }
}
indexPost.init();