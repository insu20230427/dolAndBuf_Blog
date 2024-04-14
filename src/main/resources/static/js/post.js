let index = {
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
            dataType: "json"
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
            dataType: "json"
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
            dataType: "json"
        }).done(function (res) {
            alert("글 수정이 완료되었습니다.")
            console.log("res : " + JSON.stringify(res))
            location.href = "/";
        }).fail(function (error) {
            alert(JSON.stringify(error))
        });
    },
}
index.init();