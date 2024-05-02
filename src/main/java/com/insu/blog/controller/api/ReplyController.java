package com.insu.blog.controller.api;

import com.insu.blog.dto.request.ReplyRequestDto;
import com.insu.blog.dto.response.ApiResponseDto;
import com.insu.blog.service.ReplyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RequestMapping("/api")
@RestController
public class ReplyController {

    private final ReplyService replyService;

    // 댓글 작성
    @PostMapping("/replys/{postId}")
    public ResponseEntity<ApiResponseDto> writeReply(@RequestBody ReplyRequestDto replyRequestDto){
        replyService.writeReply(replyRequestDto);
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("게시글 작성 성공!").build());
    }

    // 댓글 삭제
    @DeleteMapping("/replys/{postId}/{replyId}")
    public ResponseEntity<ApiResponseDto> deleteReply(@PathVariable int replyId) {
        replyService.deleteReply(replyId);
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("댓글 삭제 성공!").build());
    }

    // 댓글 수정
    @PutMapping("/replys/{postId}/{replyId}")
    public ResponseEntity<ApiResponseDto> updateReply(@PathVariable int replyId, @RequestBody ReplyRequestDto replyRequestDto) {
        replyService.updateReply(replyId, replyRequestDto);
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("댓글 수정 성공!").build());
    }
}
