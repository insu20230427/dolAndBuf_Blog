package com.insu.blog.controller.api;

import com.insu.blog.dto.request.UpdatePostReqDto;
import com.insu.blog.dto.response.ApiResponseDto;
import com.insu.blog.entity.Post;
import com.insu.blog.security.service.PrincipalDetails;
import com.insu.blog.service.PostService;
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
@RestController
@RequestMapping("/api")
public class PostController {
    private final PostService postService;


    // 게시글 조회
    // 메인 index(전체 게시글 조회)
    @GetMapping("/posts")
    public ResponseEntity<ApiResponseDto> index(@PageableDefault(size = 9, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<Post> posts =  postService.findAllPagedPosts(pageable);
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("게시글 조회 성공!").data(posts).build());
    }

    // 게시글 단일 조회
    @GetMapping("/posts/{postId}")
    public ResponseEntity<ApiResponseDto> getPostById(@PathVariable("postId") String postId) {
        Post post = postService.showPostDetail(Integer.parseInt(postId));
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("게시글 조회 성공!").data(post).build());
    }

    // 게시글 생성
    @PostMapping("/posts")
    public ResponseEntity<ApiResponseDto> writePost(@RequestBody Post post, @AuthenticationPrincipal PrincipalDetails userDetails) {
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
    public ResponseEntity<ApiResponseDto> updatePost(@PathVariable("id") int id, @RequestBody UpdatePostReqDto updatePostReqDto) {
        postService.updatePost(id, updatePostReqDto);
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("게시글 수정 성공!").build());
    }

    // 게시물 좋아요 추가
    @PostMapping("/posts/likes/{id}")
    public ResponseEntity<ApiResponseDto> createPostLike(@PathVariable("id") int postId, @AuthenticationPrincipal PrincipalDetails userDetails) {
        postService.createLikes(postId, userDetails.getUser());
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("좋아요 추가 성공!").data(userDetails.getUser().getId()).build());
    }

    // 게시물 좋아요 취소
    @DeleteMapping("/posts/likes/{id}")
    public ResponseEntity<ApiResponseDto> deletePostLike(@PathVariable("id") int postId, @AuthenticationPrincipal PrincipalDetails userDetails) {
       postService.deleteLikes(postId, userDetails.getUser());
       return ResponseEntity.ok().body(ApiResponseDto.builder().message("좋아요 삭제 성공!").data(userDetails.getUser().getId()).build());
    }
}
