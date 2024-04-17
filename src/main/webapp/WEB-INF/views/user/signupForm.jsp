<!DOCTYPE html>
<html lang="ko">
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="../layout/header.jsp" %>

<div class="container">
    <form>

        <div class="form-group">
            <label for="username">아이디</label>
            <input type="text" class="form-control" id="username" placeholder="아이디를 입력하세요">
        </div>

        <div class="form-group">
            <label for="password">비밀번호</label>
            <input type="password" class="form-control" id="password" placeholder="비밀번호를 입력하세요">
        </div>

        <div class="form-group">
            <label for="email">이메일</label>
            <input type="email" class="form-control" id="email" placeholder="이메일을 입력하세요">
        </div>

    </form>
    <button id="btn-signup" class="btn btn-primary">회원가입</button>
</div>

<script src="/js/user.js"></script>
<%@include file="../layout/footer.jsp" %>

