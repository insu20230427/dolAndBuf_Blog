<!DOCTYPE html>
<html lang="ko">
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="../layout/header.jsp" %>

<div class="container">
    <br/><%--하나 당 1칸 정도 내림--%>
    <div class="ui large horizontal divided list">
        <div class="item">
            <div class="content">
                <div class="header">글 번호: <span id="id">${detailPost.id}</span></div>
            </div>
        </div>
        <div class="item">
            <div class="content">
                <div class="header" id="username">작성자 : ${detailPost.user.username}</div>
            </div>
        </div>
        <div class="ui labeled button" tabindex="0">
            <div class="ui button" id="btn-post-like">
                <i class="heart icon"></i> Like
            </div>
            <div class="ui red button" id="btn-post-like-delete" style="display: none">
                <i class="heart icon"></i> Like
            </div>
            <a class="ui basic label">
                ${detailPost.likeCnt}
            </a>
        </div>
        <button class="ui icon button" onclick="history.back()"><i class="arrow left icon"></i></button>
        <button class="ui icon button" style="display: none" id="btn-post-edit" onclick="window.location.href='/view/posts/${detailPost.id}/updateForm'"><i class="edit icon"></i></button>
        <button class="ui icon button" style="display: none" id="btn-post-delete"><i class="trash alternate icon"></i></button>
    </div>
    <br/><br/>
    <div>
        <h3>${detailPost.title}</h3>
    </div>
    <hr/>
    <div>
        <div>${detailPost.content}</div>
    </div>
    <hr/>

    <br/><br/>
    <%--    <h4 class="ui horizontal divider header">--%>
    <%--        <i></i>--%>
    <%--        댓글--%>
    </h4>
    <div class="ui comments">
        <div class="ui dividing header">댓글</div>
        <div class="comment">
            <c:forEach var="reply" items="${detailPost.replyList}">
                <li id="reply-${reply.id}" class="list-group-item d-flex justify-content-between">
                    <div class="content">
                        <a class="author">${reply.user.username}</a>
                        <div class="metadata">
                            <span class="date">${reply.createDate}</span>
                        </div>
                        <div class="text reply-content" id="reply-update-content">${reply.content}</div>
                        <div class="actions">
                                <%--                            <c:choose>--%>
                                <%--                                <c:when test="${not empty principal.user.id}">--%>
                            <a onclick="indexReply.updateReplyForm(${reply.id})" class="reply"
                               id="btn-update-form">수정</a>
                            <a onclick="indexReply.updateReply(${detailPost.id}, ${reply.id})"
                               class="reply" id="btn-update-submit" style="display: none;">수정 완료
                            </a>
                            <a onclick="indexReply.deleteReply(${detailPost.id}, ${reply.id})"
                               class="reply" id="btn-delete-reply">삭제
                            </a>
                                <%--                                </c:when>--%>
                                <%--                                <c:otherwise>--%>
                                <%--                                </c:otherwise>--%>
                                <%--                            </c:choose>--%>
                        </div>
                    </div>
                </li>
            </c:forEach>
        </div>
        <form class="ui reply form">
            <input style="display: none" id="userId" value="${detailPost.user.id}"/>
            <input style="display: none" id="postId" value="${detailPost.id}"/>
            <div class="field">
                <textarea id="reply-content"></textarea>
            </div>
            <div class="ui blue labeled submit icon button" id="btn-reply-write">
                <i class="icon edit"></i> 등록
            </div>
        </form>
    </div>
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

    @media (min-width: 768px) {
        .container {
            max-width: 720px;
        }
    }

</style>
<script src="/js/reply.js"></script>
<script src="/js/post.js"></script>
<%@include file="../layout/footer.jsp" %>