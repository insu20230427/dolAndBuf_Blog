<!DOCTYPE html>
<html lang="ko">
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="../layout/header.jsp" %>

<div class="container">

    <button class="btn btn-secondary" onclick="history.back()">돌아가기</button>
    <c:if test="${detailPost.user.id == principal.user.id}">
        <a href="/view/posts/${detailPost.id}/updateForm" class="btn btn-warning">수정</a>
        <button id="btn-post-delete" class="btn btn-danger">삭제</button>
    </c:if>
    <br/><br/> <%-- <br/>하나 당 1칸 정도 내림--%>
    <div>
        글 번호 : <span id="id"><i>${detailPost.id} </i></span>
        작성자 : <span><i>${detailPost.user.username} </i></span>
    </div>
    <br/>
    <div>
        <h3>${detailPost.title}</h3>
    </div>
    <hr/>
    <div>
        <div>${detailPost.content}</div>
    </div>

</div>

<script src="/js/post.js"></script>
<%@include file="../layout/footer.jsp" %>