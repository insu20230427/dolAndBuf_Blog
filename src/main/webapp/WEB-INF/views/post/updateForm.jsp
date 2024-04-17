<!DOCTYPE html>
<html lang="ko">
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="../layout/header.jsp"%>
<%-- 경로에서 한칸 뒤로가기로 할 땐  최상단 경로 앞에 ..을 붙힘. --%>

<div class="container">
    <form>
        <input  style="display: none" id="id" value="${detailPost.id}"/>
        <div class="form-group">
            <input value="${detailPost.title}" class="form-control" id="title" placeholder="Enter title">
        </div>

        <div class="form-group">
            <textarea class="form-control summernote" rows="5" id="content">${detailPost.content}</textarea>
        </div>
    </form>
    <button id="btn-post-update" class="btn btn-primary">수정</button>
</div>

<script>
    $('.summernote').summernote({
        tabsize: 2,
        height: 300
    });
</script>
<script src="/js/post.js"></script>
<%@include file="../layout/footer.jsp"%>