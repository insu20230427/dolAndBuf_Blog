const tokenByReply = Cookies.get('Authorization');

let indexReply = {
    init: function () {
        $('#btn-reply-write').on('click', () => {
            this.writeReply();
        });
    },

    writeReply: function () {

        let data = {
            userId: $('#userId').val(), postId: $('#postId').val(), content: $('#reply-content').val(),
        }

        $.ajax({
            type: "POST",
            url: `/api/replys/${data.postId}`,
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                'Authorization': tokenByReply
            }
        }).done(function () {
            location.href = `/view/posts/${data.postId}/detailForm`;
        }).fail(function (error) {
            if (!data.userId) {
                swal({
                    text: "로그인 이용 후 댓글을 작성할 수 있습니다", icon: "error",
                });
            }
            console.log("error : " + error)
        });
    },

    updateReply: function (postId, replyId) {

        let data = {
            userId: $('#userId').val(), postId: $('#postId').val(), content: $('#reply-update-textarea').val()
        }

        if (tokenByReply) {
            const tokenValue = tokenByReply.split(' ')[1];
            const [, payloadBase64] = tokenValue.split('.');

            try {
                // Base64 디코딩 후 JSON 파싱
                const decodedPayload = JSON.parse(atob(payloadBase64));
                console.log(decodedPayload.sub)
                console.log($('#reply-username').text())

                const username = decodedPayload.sub;
                if (username !== $('#reply-username').text()) {
                    swal({
                        text: "해당 댓글의 사용자가 존재하지 않습니다", icon: "error",
                    }).then(() => {
                        setTimeout(() => {
                        }, 50);
                    });
                    return;
                }
                $.ajax({
                    type: "PUT",
                    url: `/api/replys/${postId}/${replyId}`,
                    data: JSON.stringify(data),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    headers: {
                        'Authorization': tokenByReply
                    }
                }).done(function (res) {

                    let $replyItem = $('#reply-' + replyId);
                    let $updateBtn = $replyItem.find('#btn-update-reply'); // 수정 버튼
                    let $updateSubmitBtn = $replyItem.find('#btn-update-submit'); // 수정 완료 버튼

                    // 버튼 상태 변경
                    $updateBtn.show();
                    $updateSubmitBtn.hide();

                    console.log("res : " + JSON.stringify(res))
                    location.href = `/view/posts/${postId}/detailForm`;
                }).fail(function (error) {
                    swal({
                        text: "댓글 수정을 실패했습니다. 다시 이용 부탁드립니다.", icon: "error",
                    });
                    console.log(JSON.stringify(error))
                });
            } catch (error) {
                console.error('토큰 해석 실패:', error.message);
            }
        } else {
            swal({
                text: "해당 댓글의 사용자가 존재하지 않습니다", icon: "error",
            })
        }
    },

    updateReplyForm: function (replyId) {

        // replyId를 기반으로 해당 댓글 항목을 찾습니다.
        let $replyItem = $('#reply-' + replyId); // 수정할 댓글 항목
        let $replyContent = $replyItem.find('.reply-content'); // 댓글 내용 엘리먼트
        let $updateBtn = $replyItem.find('#btn-update-form'); // 수정 버튼
        let $updateSubmitBtn = $replyItem.find('#btn-update-submit'); // 수정 완료 버튼

        // 댓글 내용을 수정할 수 있는 텍스트 영역 생성
        $replyContent.replaceWith(`
        <form class="ui reply form">
            <div class="field" id="update-reply-content">
                <textarea id="reply-update-textarea" style="width: 610px; height: 100px; margin-bottom: 10px"></textarea>
            </div>
        </form>
    `);
        // 버튼 상태 변경
        $updateBtn.hide();
        $updateSubmitBtn.show();
    },

    deleteReply: function (postId, replyId) {

        if (tokenByReply) {
            const tokenValue = tokenByReply.split(' ')[1];
            const [, payloadBase64] = tokenValue.split('.');

            try {
                // Base64 디코딩 후 JSON 파싱
                const decodedPayload = JSON.parse(atob(payloadBase64));
                console.log(decodedPayload.sub)
                console.log($('#reply-username').text())

                const username = decodedPayload.sub;
                if (username !== $('#reply-username').text()) {
                    swal({
                        text: "해당 댓글의 사용자가 존재하지 않습니다.", icon: "error",
                    }).then(() => {
                        setTimeout(() => {
                        }, 50);
                    });
                    return;
                }
                $.ajax({
                    type: "DELETE", url: `/api/replys/${postId}/${replyId}`, dataType: "json", headers: {
                        'Authorization': tokenByReply
                    }
                }).done(function (res) {
                    console.log("res : " + JSON.stringify(res))
                    location.href = `/view/posts/${postId}/detailForm`;
                }).fail(function (error) {
                    alert(JSON.stringify(error))
                });
            } catch (error) {
                console.error('토큰 해석 실패:', error.message);
            }
        } else {
            swal({
                text: "해당 댓글의 사용자가 존재하지 않습니다", icon: "error",
            })
        }
    }
}
indexReply.init();