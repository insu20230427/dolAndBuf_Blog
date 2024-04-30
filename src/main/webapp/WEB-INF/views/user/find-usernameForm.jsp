<!DOCTYPE html>
<html lang="ko">
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="../layout/header.jsp" %>

<div class="container">
    <div class="ui modal">
        <div class="header" style="text-align: center;">아이디 찾기</div>
        <form>
            <br/><br/>
            <div class="form-group">
                <label>이메일</label>
                <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="인증번호를 보낼 이메일을 입력해주세요." id="email">
                    <button type="button" id="btn-send-code-byUsername" class="ui button">인증번호 전송</button>
                </div>
                <span id="span-code"></span>
            </div>
            <div class="form-group">
                <label>인증번호</label>
                <div class="input-group mb-3">
                    <input type="text" id="code" class="form-control" placeholder="인증번호 8자리 입력">
                    <button type="button" id="btn-verify-code-byUsername" class="ui button">인증번호 확인</button>
                </div>
                <span id="span-verify"></span>
            </div>
            <span id="send-username">인증 완료 시, 링크를 클릭하면 귀하의 이메일로 아이디가 발송됩니다.</span>
            <br/><br/><br/><br/>
        </form>
        <br/>
        <button class="btn btn-secondary" style="display: block; margin: 0 auto;"
                onclick="window.location.href = '/view/auth/loginForm'">돌아가기
        </button>
    </div>
</div>

<style>
    /* 기본 스타일 */
    html, body {
        height: 100%;
        margin: 0;
        padding: 0;
    }
    .container {
        width: 100%;
        height: 78%;
    }

    .ui.modal {
        top: 40%; /* 화면 위에서 50% 위치로 이동 */
        left: 50%; /* 화면 왼쪽에서 50% 위치로 이동 */
        transform: translate(-50%, -50%) !important; /* 중앙 정렬 */
        animation-duration: 0s !important;
    }

    /* 모달 크기 설정 */
    .ui.modal {
        width: 500px;
        height: 600px;
    }

    /* 기본 스타일 */
    #send-username {
        color: cornflowerblue;
        font-size: small;
        cursor: pointer;
        transition: color 0.1s; /* 색 변화 효과를 위한 전환 효과 설정 */
    }

    /* 마우스를 올렸을 때의 스타일 */
    #send-username:hover {
        color: royalblue; /* 마우스를 올렸을 때 색상 변경 */
    }

    /* 클릭했을 때의 스타일 */
    #send-username:active {
        color: darkblue; /* 클릭했을 때 색상 변경 */
    }

</style>

<script>
    $('.ui.modal').modal({
        closable: false
    }).modal('show');
</script>
<script src="/js/user.js"></script>
<%@include file="../layout/footer.jsp" %>