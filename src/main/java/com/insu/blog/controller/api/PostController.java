package com.insu.blog.controller.api;

import com.insu.blog.dto.response.ApiResponseDto;
import com.insu.blog.entity.Post;
import com.insu.blog.security.service.UserDetailsImpl;
import com.insu.blog.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class PostController {

    private final PostService postService;

    // 게시글 작성
    @PostMapping("/posts")
    public ResponseEntity<ApiResponseDto> writePost(@RequestBody Post post, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        postService.writePost(post, userDetails.getUser());
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("게시글 작성 성공!").build());
    }

    // 게시글 삭제
    @DeleteMapping("/posts/{id}")
    public ResponseEntity<ApiResponseDto> deletePost(@PathVariable("id") int id) {
        postService.deletePost(id);
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("게시글 삭제 성공!").build());
    }

    // 게시글 수정
    @PutMapping("/posts/{id}")
    public ResponseEntity<ApiResponseDto> updatePost(@PathVariable("id") int id, @RequestBody Post post) {
        postService.updatePost(id, post);


        return ResponseEntity.ok().body(ApiResponseDto.builder().message("게시글 수정 성공!").build());
    }
}
