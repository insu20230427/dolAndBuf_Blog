package com.insu.blog.service;

import com.insu.blog.entity.Post;
import com.insu.blog.entity.User;
import com.insu.blog.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    // 글 작성
    @Transactional
    public void writePost(Post post, User user) {
        post.setCount(0);
        post.setUser(user);
        postRepository.save(post);
    }

    // 게시글 삭제
    @Transactional
    public void deletePost(int id) {
        postRepository.deleteById(id);
    }

    // 게시글 수정
    @Transactional
    public void updatePost(int id, Post post) {
        Post updatePost = postRepository.findById(id).get();
        updatePost.setContent(post.getContent());
        updatePost.setTitle(post.getTitle());
    }

    // 페이징된 글 전체 조회
    @Transactional(readOnly = true)
    public Page<Post> findAllPagedPosts(Pageable pageable) {
        return postRepository.findAll(pageable);
    }

    // 상세 게시글 조회
    @Transactional(readOnly = true)
    public Post showPostDetail(int id) {
        return postRepository.findById(id).get();
    }
}
