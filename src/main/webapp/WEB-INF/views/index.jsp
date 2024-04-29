<!DOCTYPE html>
<html lang="ko">
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<style>
    .container {
        height: auto;
        min-height: 100%;
    }

    .ui.cards .card {
        transition: box-shadow 0.3s, background-color 0.3s; /* 변화를 부드럽게 만듦 */
    }

    .ui.cards .card:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 마우스를 가져다 대었을 때 그림자 추가 */
    }
</style>

<%@include file="layout/header.jsp" %>
<br/><br/>
<div class="container" >
    <div class="ui grid">
        <div class="three column row">
            <c:forEach var="post" items="${posts.content}">
                <div class="column">
                    <div class="ui cards m-3" style="height: 250px;">
                        <div class="card" onclick="window.location.href = '/view/posts/${post.id}/detailForm';"
                             style="cursor: pointer;">
                            <c:set var="truncatedContent" value="${fn:substring(post.content, 0, 50)}"/>
                            <div class="content">
                                <div class="header" style="text-align: center; margin-top: 5px">${post.title}</div>
                                <c:choose>
                                    <c:when test="${fn:length(post.content) > 50}">
                                        <div class="description" style="text-align: center; margin-top: 5px">${truncatedContent}...</div>
                                    </c:when>
                                    <c:otherwise>
                                        <div class="description"style="text-align: center; margin-top: 5px">${post.content}</div>
                                    </c:otherwise>
                                </c:choose>
                                <br/>
                                <div class="extra content">
                                    <c:choose>
                                        <c:when test="${not empty post.modifyDate}">
                                            <div style="font-size: x-small; text-align: center;">수정일 : ${post.modifyDate}</div>
                                        </c:when>
                                        <c:otherwise>
                                            <div style="font-size: x-small; text-align: center">작성일 : ${post.createDate}</div>
                                        </c:otherwise>
                                    </c:choose>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </c:forEach>
        </div>
    </div>
</div>

<ul class="pagination justify-content-center">
    <c:choose>
        <c:when test="${posts.first}">
            <li class="page-item disabled"><a class="page-link" href="?page=${posts.number-1}"><i
                    class="reply icon"></i></a></li>
        </c:when>
        <c:otherwise>
            <li class="page-item"><a class="page-link" href="?page=${posts.number-1}"><i class="reply icon"></i></a>
            </li>
        </c:otherwise>
    </c:choose>
    <c:forEach var="i" begin="1" end="${posts.totalPages}">
        <c:choose>
            <c:when test="${i eq posts.number + 1}">
                <li class="page-item active" style="opacity: 0.3;"><a class="page-link" href="?page=${i-1}">${i}</a>
                </li>
            </c:when>
            <c:otherwise>
                <li class="page-item"><a class="page-link" href="?page=${i-1}">${i}</a></li>
            </c:otherwise>
        </c:choose>
    </c:forEach>

    <c:choose>
        <c:when test="${posts.last}">
            <li class="page-item disabled"><a class="page-link" href="?page=${posts.number+1}"> <i
                    class="share icon"></i></a></li>
        </c:when>
        <c:otherwise>
            <li class="page-item"><a class="page-link" href="?page=${posts.number+1}"> <i
                    class="share icon"></i></a></li>
        </c:otherwise>
    </c:choose>
</ul>

<%@include file="layout/footer.jsp" %>

