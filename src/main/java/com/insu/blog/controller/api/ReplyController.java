package com.insu.blog.controller.api;

import com.insu.blog.dto.request.ReplyRequestDto;
import com.insu.blog.dto.response.ApiResponseDto;
import com.insu.blog.entity.Reply;
import com.insu.blog.service.ReplyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<ApiResponseDto> getReply(@PathVariable("postId") String postId){
        List<Reply> replies = replyService.getReply(postId);
        log.info("댓글 : " + replies);
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("게시글 조회 성공!").data(replies).build());
    }

    // 댓글 작성
    @PostMapping("/replys/{postId}")
    public ResponseEntity<ApiResponseDto> writeReply(@RequestBody ReplyRequestDto replyRequestDto){
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
    public ResponseEntity<ApiResponseDto> updateReply(@PathVariable("replyId") int replyId, @RequestBody ReplyRequestDto replyRequestDto) {
        replyService.updateReply(replyId, replyRequestDto);
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("댓글 수정 성공!").build());
    }
}
