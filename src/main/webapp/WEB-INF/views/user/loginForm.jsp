<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<!DOCTYPE html>
<html lang="ko">
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="../layout/header.jsp" %>

<div class="container">
    <form>
        <div class="form-group">
            <label for="username">Username</label>
            <input type="text"  class="form-control" placeholder="Enters username" id="username">
        </div>

        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" class="form-control" placeholder="Enter password" id="password">
        </div>
    </form>
    <button type="button" id="btn-login" class="btn btn-primary">로그인</button>

    <a href="https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=ee8abaaf81bcb4e83dff921f9a492de6&redirect_uri=http://localhost:8080/api/oauth2/kakao/callback">
        <img src="/image/kakao_login_button.png" style="height: 38px">
    </a>
    <a href="https://nid.naver.com/oauth2.0/authorize?&response_type=code&client_id=QP_CM_KT5kXHb44_BWpl&redirect_uri=http://localhost:8080/api/oauth2/naver/callback">
        <img src="/image/naver_login_button.png" style="height: 38px; width: 90px">
    </a>
<%--    <a href="/oauth2/authorization/google">--%>
<%--        <img src="/image/google_login_button.png" style="height: 44px">--%>
<%--    </a>--%>
    <br/>
    <div><a href="signupForm">아직 회원가입을 하지 않으셨나요?</a></div>
    <div><a href="find-usernameForm">아이디 찾기</a></div>
    <div><a href="find-passwordForm">비밀번호 찾기</a></div>
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

</style>
<script src="/js/user.js"></script>
<%@include file="../layout/footer.jsp" %>

