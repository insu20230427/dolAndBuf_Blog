let indexReply = {
    init: function () {
        $('#btn-reply-write').on('click', () => {
            this.writeReply();
        });
    },

    writeReply: function () {

        let data = {
            userId: $('#userId').val(),
            postId: $('#postId').val(),
            content: $('#reply-content').val(),
        }

        $.ajax({
            type: "POST",
            url: `/api/replys/${data.postId}`,
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function (res) {
            alert("댓글 작성이 완료되었습니다.")
            console.log("res : " + JSON.stringify(res))
            location.href = `/view/posts/${data.postId}/detailForm`;
        }).fail(function (error) {
            alert(JSON.stringify(error))
        });
    },

    updateReply: function (postId, replyId) {

        let $replyItem = $(this).closest('li'); // 수정한 댓글 항목
        let $replyContent = $replyItem.find('.reply-content'); // 댓글 내용 엘리먼트

        let data = {
            userId: $('#userId').val(),
            postId: $('#postId').val(),
            content: $('#reply-update-content').text(),
        }

        console.log(data.content);

        $.ajax({
            type: "PUT",
            url: `/api/replys/${postId}/${replyId}`,
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function (res) {

            // 댓글 내용 텍스트로 변경
            $replyContent.text(data.content);

            let $updateBtn = $replyItem.find('.btn-update-reply'); // 수정 버튼
            let $updateSubmitBtn = $replyItem.find('.btn-update-submit'); // 수정 완료 버튼

            // 버튼 상태 변경
            $updateBtn.show();
            $updateSubmitBtn.hide();

            alert("댓글 수정이 완료되었습니다.")
            console.log("res : " + JSON.stringify(res))
            console.log("content" + data.content)
            location.href = `/view/posts/${postId}/detailForm`;
        }).fail(function (error) {
            alert(JSON.stringify(error))
        });
    },

    updateReplyForm: function (replyId) {
        console.log("버튼 클릭 완료")
        console.log(replyId)

        // replyId를 기반으로 해당 댓글 항목을 찾습니다.
        let $replyItem = $('#reply-' + replyId); // 수정할 댓글 항목
        let $replyContent = $replyItem.find('.reply-content'); // 댓글 내용 엘리먼트
        let $updateBtn = $replyItem.find('.btn-update-form'); // 수정 버튼
        let $updateSubmitBtn = $replyItem.find('.btn-update-submit'); // 수정 완료 버튼

        // 댓글 내용을 수정할 수 있는 텍스트 영역 생성
        $replyContent.attr('contenteditable', true).addClass('form-control').focus();

        // 버튼 상태 변경
        $updateBtn.hide();

        $updateSubmitBtn.show();
    },

    deleteReply: function (postId, replyId) {

        $.ajax({
            type: "DELETE",
            url: `/api/replys/${postId}/${replyId}`,
            dataType: "json"
        }).done(function (res) {
            alert("댓글 삭제가 완료되었습니다.")
            console.log("res : " + JSON.stringify(res))
            location.href = `/view/posts/${postId}/detailForm`;
        }).fail(function (error) {
            alert(JSON.stringify(error))
        });
    }
}
indexReply.init();