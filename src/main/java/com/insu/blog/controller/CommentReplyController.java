package com.insu.blog.controller;

import com.insu.blog.dto.request.CommentReplyRequestDto;
import com.insu.blog.dto.response.ApiResponseDto;
import com.insu.blog.entity.CommentReply;
import com.insu.blog.security.service.PrincipalDetails;
import com.insu.blog.service.CommentReplyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api")
public class CommentReplyController {
    private final CommentReplyService commentReplyService;

    // 대댓글 조회
    @GetMapping("/comments/{postId}/{replyId}")
    public ResponseEntity<ApiResponseDto> getCommentReply(@PathVariable("replyId") String replyId) {
        List<CommentReply> replies = commentReplyService.getCommentReply(replyId);
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("게시글 조회 성공!").data(replies).build());
    }

    // 대댓글 작성
    @PostMapping("/comments/{postId}/{replyId}")
    public ResponseEntity<ApiResponseDto> writeCommentReply(@PathVariable("replyId") String replyId,
                                                            @PathVariable("postId") String postId,
                                                            @RequestBody CommentReplyRequestDto req) {
        commentReplyService.writeReply(req, postId, replyId);
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("게시글 작성 성공!").build());
    }

    // 대댓글 삭제
    @DeleteMapping("/comments/{postId}/{replyId}/{commentId}")
    public ResponseEntity<ApiResponseDto> deleteCommentReply(@PathVariable("commentId") String commentId) {
        commentReplyService.deleteReply(commentId);
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("댓글 삭제 성공!").build());
    }

    // 대댓글 수정
    @PutMapping("/comments/{postId}/{replyId}/{commentId}")
    public ResponseEntity<ApiResponseDto> updateCommentReply(@PathVariable("commentId") String commentId,
                                                             @RequestBody CommentReplyRequestDto req) {
        commentReplyService.updateReply(commentId, req);
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("댓글 수정 성공!").build());
    }

    // 대댓글 좋아요 추가
    @PostMapping("/comments/likes/{replyId}/{commentId}")
    public ResponseEntity<ApiResponseDto> createPostLike(@PathVariable("commentId") String commentId,
                                                         @AuthenticationPrincipal PrincipalDetails userDetails) {
        commentReplyService.createLikes(commentId, userDetails.getUser());
        return ResponseEntity.ok()
                .body(ApiResponseDto.builder().message("좋아요 추가 성공!").data(userDetails.getUser().getId()).build());
    }

    // 대댓글 좋아요 취소
    @DeleteMapping("/comments/likes/{replyId}/{commentId}")
    public ResponseEntity<ApiResponseDto> deletePostLike(@PathVariable("commentId") String commentId,
                                                         @AuthenticationPrincipal PrincipalDetails userDetails) {
        commentReplyService.deleteLikes(commentId, userDetails.getUser());
        return ResponseEntity.ok()
                .body(ApiResponseDto.builder().message("좋아요 삭제 성공!").data(userDetails.getUser().getId()).build());
    }
}
