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
                        <label>비밀번호</label>
                        <input type="password" class="form-control" id="update-password" placeholder="비밀번호를 입력하세요">
                        <span style="color: cornflowerblue; font-size: small">비밀번호는 영문, 숫자, 특수문자의 조합으로 8~16자리여야 합니다.</span>
                    </div>
                    <div class="form-group">
                        <label>이메일</label>
                        <input type="email" value="${principal.user.email}" class="form-control" id="update-email" placeholder="이메일을 입력하세요">
                        <span></span>
                    </div>
                <button type="button" id="btn-user-update" class="btn btn-primary">회원수정</button>
            </c:when>
            <c:otherwise>
                <div class="form-group">
                    <label>이메일</label>
                    <input type="email" value="${principal.user.email}" class="form-control" placeholder="이메일을 입력하세요" readonly>
                </div>
            </c:otherwise>
        </c:choose>
    </form>
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

// (마지막) 프론트 최소한 다듬어야됨.
// 채팅 redis