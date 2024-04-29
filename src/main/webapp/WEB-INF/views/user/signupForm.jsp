<!DOCTYPE html>
<html lang="ko">
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="../layout/header.jsp" %>


<div class="container">
    <form>
<%--        <div class="was-validated">--%>
        <div class="form-group">
            <label for="username">아이디</label>
            <input type="text" class="form-control" id="username" placeholder="아이디를 입력하세요">
<%--            <div class="invalid-feedback">아이디는 필수 입력값입니다.</div>--%>
            <span style="color: cornflowerblue; font-size: small">아이디는 영문, 숫자의 조합으로 5 ~ 13자리여야 합니다.</span>
        </div>

        <div class="form-group">
            <label for="password">비밀번호</label>
            <input type="password" class="form-control" id="password" placeholder="비밀번호를 입력하세요">
<%--            <div class="invalid-feedback">비밀번호는 필수 입력값입니다.</div>--%>
            <span style="color: cornflowerblue; font-size: small">비밀번호는 영문, 숫자, 특수문자의 조합으로 8~16자리여야 합니다.</span>
        </div>

        <div class="form-group">
            <label for="email">이메일</label>
            <input type="email" class="form-control" id="email" placeholder="이메일을 입력하세요">
<%--            <div class="invalid-feedback">이메일은 필수 입력값입니다.</div>--%>
            <span></span>
        </div>
<%--        </div>--%>
    </form>
    <button id="btn-signup" class="btn btn-primary">회원가입</button>

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

