<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>insu's 블로그</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">

    <script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.js"></script>

    <link href="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-bs4.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-bs4.min.js"></script>
</head>

<body>
<nav class="navbar navbar-expand-md bg-dark navbar-dark">
    <a class="navbar-brand" href="/">insu's blog</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="collapsibleNavbar">
<%--        <c:choose>--%>
<%--            <c:when test="${empty principal}">--%>
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link" href="/view/auth/loginForm">로그인</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/view/auth/signupForm">회원가입</a>
                    </li>
                </ul>
<%--            </c:when>--%>
<%--            <c:otherwise>--%>
                <ul class="navbar-nav">
                    <li class="nav-item" >
                        <a class="nav-link" href="/view/posts/writeForm" style="text-align: center !important; display: flex !important;">글쓰기</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/view/users/infoForm">회원정보</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="http://localhost:8080/api/users/logout">로그아웃</a>
                    </li>
                </ul>
<%--            </c:otherwise>--%>
<%--        </c:choose>--%>
    </div>
</nav>
<br/>
