package com.insu.blog.controller.api;

import com.insu.blog.dto.request.ReplyRequestDto;
import com.insu.blog.dto.response.ApiResponseDto;
import com.insu.blog.entity.Reply;
import com.insu.blog.security.service.PrincipalDetails;
import com.insu.blog.service.ReplyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api")
@RestController
public class ReplyController {

    private final ReplyService replyService;

    // 댓글 조회
    @GetMapping("/replys/{postId}")
    public ResponseEntity<ApiResponseDto> getReply(@PathVariable("postId") String postId) {
        List<Reply> replies = replyService.getReply(postId);
        log.info("댓글 : {}", replies);
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("게시글 조회 성공!").data(replies).build());
    }

    // 댓글 작성
    @PostMapping("/replys/{postId}")
    public ResponseEntity<ApiResponseDto> writeReply(@RequestBody ReplyRequestDto replyRequestDto) {
        log.info("reply : {}", replyRequestDto);
        replyService.writeReply(replyRequestDto);
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("게시글 작성 성공!").build());
    }

    // 댓글 삭제
    @DeleteMapping("/replys/{postId}/{replyId}")
    public ResponseEntity<ApiResponseDto> deleteReply(@PathVariable("replyId") int replyId) {
        replyService.deleteReply(replyId);
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("댓글 삭제 성공!").build());
    }

    // 댓글 수정
    @PutMapping("/replys/{postId}/{replyId}")
    public ResponseEntity<ApiResponseDto> updateReply(@PathVariable("replyId") int replyId,
            @RequestBody ReplyRequestDto replyRequestDto) {
        replyService.updateReply(replyId, replyRequestDto);
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("댓글 수정 성공!").build());
    }

    // 댓글 좋아요 추가
    @PostMapping("/replys/likes/{replyId}")
    public ResponseEntity<ApiResponseDto> createPostLike(@PathVariable("replyId") int replyId,
            @AuthenticationPrincipal PrincipalDetails userDetails) {
        replyService.createLikes(replyId, userDetails.getUser());
        return ResponseEntity.ok()
                .body(ApiResponseDto.builder().message("좋아요 추가 성공!").data(userDetails.getUser().getId()).build());
    }

    // 댓글 좋아요 취소
    @DeleteMapping("/replys/likes/{replyId}")
    public ResponseEntity<ApiResponseDto> deletePostLike(@PathVariable("replyId") int replyId,
            @AuthenticationPrincipal PrincipalDetails userDetails) {
        replyService.deleteLikes(replyId, userDetails.getUser());
        return ResponseEntity.ok()
                .body(ApiResponseDto.builder().message("좋아요 삭제 성공!").data(userDetails.getUser().getId()).build());
    }
}
