<!DOCTYPE html>
<html lang="ko">
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<style>
    /* 기본 스타일 */
    html, body {
        height: 100%;
        margin: 0;
        padding: 0;
    }
    .container {
        width: 100%;
        height: 90%;
    }

    /*!* 세로 반응형 스타일 *!*/
    /*@media screen and (max-height: 300px) {*/
    /*    .container {*/
    /*        overflow-y: auto; !* 세로 스크롤이 필요한 경우 스크롤 표시 *!*/
    /*        overflow-x: hidden; !* 가로 스크롤이 생길 경우 숨김 *!*/
    /*    }*/
    /*}*/
</style>

<%@include file="layout/header.jsp" %>

<div class="container">

    <c:forEach var="post" items="${posts.content}">
        <div class="card m-2">
            <div class="card-body">
                <h4 class="card-title">${post.title}</h4>
                <a href="/view/posts/${post.id}/detailForm" class="btn btn-primary">상세보기</a>
            </div>
        </div>
    </c:forEach>

    <ul class="pagination justify-content-center">

        <c:choose>
            <c:when test="${posts.first}">
                <li class="page-item disabled"><a class="page-link" href="?page=${posts.number-1}">Previous</a></li>
            </c:when>
            <c:otherwise>
                <li class="page-item"><a class="page-link" href="?page=${posts.number-1}">Previous</a></li>
            </c:otherwise>
        </c:choose>

        <c:forEach var="i" begin="1" end="${posts.totalPages}">
            <c:choose>
                <c:when test="${i eq posts.number + 1}">
                    <li class="page-item active" style="opacity: 0.3;"><a class="page-link" href="?page=${i-1}">${i}</a></li>
                </c:when>
                <c:otherwise>
                    <li class="page-item"><a class="page-link" href="?page=${i-1}">${i}</a></li>
                </c:otherwise>
            </c:choose>
        </c:forEach>

        <c:choose>
            <c:when test="${posts.last}">
                <li class="page-item disabled"><a class="page-link" href="?page=${posts.number+1}">Next</a></li>
            </c:when>
            <c:otherwise>
                <li class="page-item"><a class="page-link" href="?page=${posts.number+1}">Next</a></li>
            </c:otherwise>
        </c:choose>
    </ul>

</div>

<%@include file="layout/footer.jsp" %>

