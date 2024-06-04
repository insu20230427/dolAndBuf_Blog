package com.insu.blog.controller.api;

import com.insu.blog.dto.request.CategoryRequestDto;
import com.insu.blog.dto.request.UpdatePostReqDto;
import com.insu.blog.dto.response.ApiResponseDto;
import com.insu.blog.entity.Category;
import com.insu.blog.entity.Post;
import com.insu.blog.security.service.PrincipalDetails;
import com.insu.blog.service.CategoryService;
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
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class PostController {

    private final PostService postService;
    private final CategoryService categoryService;

    // 게시글 조회
    // 메인 index(전체 게시글 조회)
    @GetMapping("/posts")
    public ResponseEntity<ApiResponseDto> index(
            @PageableDefault(size = 9, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<Post> posts = postService.findAllPagedPosts(pageable);
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
    public ResponseEntity<ApiResponseDto> writePost(@RequestBody Post post,
            @RequestParam String categoryId,
            @AuthenticationPrincipal PrincipalDetails userDetails) {

        Category category = categoryService.getCategoryById(Integer.parseInt(categoryId))
                .orElseThrow(() -> new NullPointerException("해당 카테고리가 없습니다."));

        post.setCategory(category);

        log.info("Post : {} ", post);

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
    public ResponseEntity<ApiResponseDto> updatePost(@PathVariable("id") int id,
            @RequestBody UpdatePostReqDto updatePostReqDto) {
        postService.updatePost(id, updatePostReqDto);
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("게시글 수정 성공!").build());
    }

    // 게시물 좋아요 추가
    @PostMapping("/posts/likes/{id}")
    public ResponseEntity<ApiResponseDto> createPostLike(@PathVariable("id") int postId,
            @AuthenticationPrincipal PrincipalDetails userDetails) {
        postService.createLikes(postId, userDetails.getUser());
        return ResponseEntity.ok()
                .body(ApiResponseDto.builder().message("좋아요 추가 성공!").data(userDetails.getUser().getId()).build());
    }

    // 게시물 좋아요 취소
    @DeleteMapping("/posts/likes/{id}")
    public ResponseEntity<ApiResponseDto> deletePostLike(@PathVariable("id") int postId,
            @AuthenticationPrincipal PrincipalDetails userDetails) {
        postService.deleteLikes(postId, userDetails.getUser());
        return ResponseEntity.ok()
                .body(ApiResponseDto.builder().message("좋아요 삭제 성공!").data(userDetails.getUser().getId()).build());
    }

    // 게시글 검색
    @GetMapping("/posts/search")
    public ResponseEntity<ApiResponseDto> searchPosts(
            @RequestParam("type") int type,
            @RequestParam("keyword") String keyword,
            @PageableDefault(size = 9, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<Post> posts;
        switch (type) {
            case 0: // 제목으로 검색
                posts = postService.searchPostsByTitle(keyword, pageable);
                break;
            case 1: // 내용으로 검색
                posts = postService.searchPostsByContent(keyword, pageable);
                break;
            case 2: // 제목 또는 내용으로 검색
                posts = postService.searchPostsByTitleOrContent(keyword, pageable);
                break;
            default:
                return ResponseEntity.badRequest().body(ApiResponseDto.builder().message("잘못된 검색 타입입니다.").build());
        }

        return ResponseEntity.ok().body(ApiResponseDto.builder().message("검색 성공!").data(posts).build());
    }

    // 카테고리 조회
    @GetMapping("/categories/{userId}")
    public List<CategoryRequestDto> getCategoriesByUserId(@PathVariable int userId) {
        List<Category> categories = categoryService.getCategoriesByUserId(userId);
        List<CategoryRequestDto> categoryRequestDtos = categories.stream()
                .map(CategoryRequestDto::fromEntity)
                .collect(Collectors.toList());

        return categoryRequestDtos;
    }

    // 카테고리 ID에 따른 포스트 페이징 조회
    @GetMapping("/{categoryId}/posts")
    public ResponseEntity<ApiResponseDto> getPostsByCategoryId(
            @PathVariable int categoryId,
            @PageableDefault(size = 9, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<Post> posts = categoryService.getPostsByCategoryId(categoryId, pageable);
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("카테고리 게시글 조회 성공!").data(posts).build());
    }

    // 카테고리 생성
    @PostMapping("/categories")
    public ResponseEntity<ApiResponseDto> createCategory(@RequestBody CategoryRequestDto category) {
        log.info("categoryDto: {}", category);

        categoryService.createCategory(category);
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("카테고리 생성 성공!").build());
    }

    // 카테고리 수정
    @PutMapping("/categories/{id}")
    public ResponseEntity<ApiResponseDto> updateCategory(@PathVariable String id,
            @RequestBody CategoryRequestDto category) {
        category.setId(Integer.parseInt(id));
        categoryService.updateCategory(Integer.parseInt(id), category);
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("카테고리 수정 성공!").build());
    }

    // 카테고리 삭제
    @DeleteMapping("/categories/{categoryId}")
    public ResponseEntity<ApiResponseDto> deleteCategory(@PathVariable("categoryId") int categoryId) {
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("카테고리 삭제 성공!").build());
    }

}
