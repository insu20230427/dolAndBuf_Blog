package com.insu.blog.controller.view;

import com.insu.blog.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Slf4j
@RequiredArgsConstructor
@Controller
public class JspPostController {

    private final PostService postService;

    // 메인 index(전체 게시글 조회)
    @GetMapping({"", "/"})
    public String index(Model model, @PageableDefault(size = 2, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        model.addAttribute("posts", postService.findAllPagedPosts(pageable));
        log.info("posts : " + postService.findAllPagedPosts(pageable));
        return "index";
    }

    // 글 작성 폼
    @GetMapping("/view/posts/writeForm")
    public String writeForm() {
        return "post/writeForm";
    }

    //글 수정 폼
    @GetMapping("/view/posts/{id}/updateForm")
    public String updateForm(@PathVariable int id, Model model) {
        model.addAttribute("detailPost", postService.showPostDetail(id));
        return "post/updateForm";
    }


    // 상세 게시글 조회
    @GetMapping("/view/posts/{postId}/detailForm")
    public String showPostDetail(@PathVariable int postId, Model model) {
        model.addAttribute("detailPost", postService.showPostDetail(postId));
        return "post/detailForm";
    }
}
