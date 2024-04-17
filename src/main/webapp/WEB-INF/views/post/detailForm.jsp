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
    <hr/>

    <div class="card">
        <%--form태그 안에 있으면 button type submit이 되므로 type="button"임을 명시--%>
        <form>
            <input style="display: none" id="userId" value="${principal.user.id}"/>
            <input style="display: none" id="postId" value="${detailPost.id}"/>
            <div class="card-body">
                <textarea id="reply-content" class="form-control" rows="1"></textarea>
            </div>
            <div class="card-footer">
                <button type="button" id="btn-reply-write" class="btn btn-primary">등록</button>
            </div>
        </form>
    </div>
    <br/>
    <div class="card">
        <div class="card-header">댓글 리스트</div>
        <ul id="reply-box" class="list-group">
            <c:forEach var="reply" items="${detailPost.replyList}">
                <li id="reply-${reply.id}" class="list-group-item d-flex justify-content-between">
                    <div class="reply-content" id="reply-update-content">${reply.content}</div>
                    <div class="d-flex">
                        <div class="font-italic">${reply.user.username}</div>
                        <button onclick="indexReply.updateReplyForm(${reply.id})" class="badge btn-update-form" >수정</button>
                        <div class="btn-group" role="group">
                            <button onclick="indexReply.updateReply(${detailPost.id}, ${reply.id})" class="badge btn-update-submit" style="display: none;">수정 완료</button>
                            <button onclick="indexReply.deleteReply(${detailPost.id}, ${reply.id})" class="badge btn-delete-reply">삭제</button>
                        </div>
                    </div>
                </li>
            </c:forEach>
        </ul>
    </div>
</div>
<script src="/js/reply.js"></script>
<script src="/js/post.js"></script>
<%@include file="../layout/footer.jsp" %>