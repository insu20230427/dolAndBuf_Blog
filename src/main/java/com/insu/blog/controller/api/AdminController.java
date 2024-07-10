package com.insu.blog.controller.api;

import com.insu.blog.dto.request.AdminReplysRequestDto;
import com.insu.blog.dto.response.ApiResponseDto;
import com.insu.blog.entity.Post;
import com.insu.blog.security.service.PrincipalDetails;
import com.insu.blog.service.PostService;
import com.insu.blog.service.ReplyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/admin")
@RestController
public class AdminController {

    private final PostService postService;
    private final ReplyService replyService;

    // 포스트 불러오기
    @GetMapping("/posts")
    public ResponseEntity<ApiResponseDto> getPosts(@AuthenticationPrincipal PrincipalDetails principalDetails,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<Post> posts = postService.findAllPagedPostsByUser(pageable,
                String.valueOf(principalDetails.getUser().getId()));
        log.info("포스트 : {}", posts);
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("게시글 조회 성공!").data(posts).build());
    }

    // 댓글 불러오기
    @GetMapping("/replys")
    public ResponseEntity<ApiResponseDto> getReplys(@AuthenticationPrincipal PrincipalDetails principalDetails,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<AdminReplysRequestDto> replys = replyService.getRepliesByUserPosts(pageable,
                principalDetails.getUser().getId());
        log.info("댓글 : {}", replys);
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("댓글 조회 성공!").data(replys).build());
    }

    // 댓글 삭제
    @DeleteMapping("/replys/{replyId}")
    public ResponseEntity<ApiResponseDto> deleteReply(@PathVariable("replyId") int replyId) {
        replyService.deleteReply(replyId);
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("댓글 삭제 성공!").build());
    }

}
