<!DOCTYPE html>
<html lang="ko">
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="../layout/header.jsp" %>

<div class="container">
    <form>
        <input style="display: none" id="id" value="${principal.user.id}"/>
        <div class="form-group">
            <label for="username">아이디</label>
            <input type="text" value="${principal.user.username}" class="form-control" id="username" readonly>
        </div>

        <c:choose>
            <c:when test="${empty principal.user.oauth}">
                <div class="form-group">
                    <label for="password">비밀번호</label>
                    <input type="password" class="form-control" id="password" placeholder="비밀번호를 입력하세요">
                </div>
                <div class="form-group">
                    <label for="email">이메일</label>
                    <input type="email" value="${principal.user.email}" class="form-control" id="email"
                           placeholder="이메일을 입력하세요">
                </div>
            </c:when>
            <c:otherwise>
                <div class="form-group">
                    <label for="email">이메일</label>
                    <input type="email" value="${principal.user.email}" class="form-control"
                           placeholder="이메일을 입력하세요" readonly>
                </div>
            </c:otherwise>
        </c:choose>

    </form>
    <button id="btn-user-update" class="btn btn-primary">회원수정</button>
</div>

<script src="/js/user.js"></script>
<%@include file="../layout/footer.jsp" %>