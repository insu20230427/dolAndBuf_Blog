package com.insu.blog.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.insu.blog.entity.Post;
import com.insu.blog.entity.PostLike;
import com.insu.blog.entity.User;
import com.insu.blog.repository.PostLikeRepository;
import com.insu.blog.repository.PostRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final PostLikeRepository postLikeRepository;

    // 글 작성
    @Transactional
    public void writePost(Post post, User user) {
        post.setCount(0);
        post.setUser(user);
        post.setContent(post.getContent().replaceAll("<(/)?([a-zA-Z]*)(\\s[a-zA-Z]*=[^>]*)?(\\s)*(/)?>", ""));
        postRepository.save(post);
    }

    // 게시글 삭제
    @Transactional
    public void deletePost(int boardId) {
        postRepository.deleteById(boardId);
    }

    // 게시글 수정
    @Transactional
    public void updatePost(int boardId, Post post) {
        Post updatePost = postRepository.findById(boardId).orElseThrow(() -> new IllegalArgumentException("게시글 찾기 실패"));
        updatePost.setContent(post.getContent().replaceAll("<(/)?([a-zA-Z]*)(\\s[a-zA-Z]*=[^>]*)?(\\s)*(/)?>", ""));
        updatePost.setTitle(post.getTitle());
    }

    // 페이징된 글 전체 조회
    @Transactional(readOnly = true)
    public Page<Post> findAllPagedPosts(Pageable pageable) {
        return postRepository.findAll(pageable);
    }

    // 상세 게시글 조회
    @Transactional(readOnly = true)
    public Post showPostDetail(int postId) {
        return postRepository.findById(postId).orElseThrow(() -> new IllegalArgumentException("게시글 찾기 실패"));
    }

    // 게시글 좋아요
    public void createLikes(int postId, User user) {

        Optional<PostLike> existingLikesOptional = postLikeRepository.findByPostIdAndUserId(postId, user.getId());
        if (!existingLikesOptional.isPresent()) { // 좋아요를 한번도 누르지 않은 사람
            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> new IllegalArgumentException("해당 게시물이 존재하지 않습니다."));

            PostLike newLikes = new PostLike(true, post, user);
            post.setLikeCnt(post.getLikeCnt() + 1);
            postLikeRepository.save(newLikes);
        } else { // 좋아요를 눌러본 사람
            PostLike existingLikes = existingLikesOptional.get();

            if (!existingLikes.isLikes()) { // 좋아요를 취소한 경우 = likes가 false인 경우
                existingLikes.setLikes(true);
                existingLikes.getPost().setLikeCnt(existingLikes.getPost().getLikeCnt() + 1);
                postLikeRepository.save(existingLikes);
            } else { // 좋아요를 이미 누른 경우 = likes가 true인 경우
                throw new IllegalArgumentException("이미 좋아요를 눌렀습니다.");
            }
        }
    }

    // 게시글 좋아요 취소
    public void deleteLikes(int postId, User user) {

        PostLike postLike = postLikeRepository.findByPostIdAndUserId(postId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글 좋아요가 존재하지 않습니다."));

        likesValid(postLike, user);

        if (!postLike.isLikes()) { // 좋아요를 취소한 경우 = likes가 false인 경우
            throw new IllegalArgumentException("이미 좋아요를 취소했습니다.");
        } else { // 좋아요를 이미 누른 경우
            postLike.setLikes(false);
            postLike.getPost().setLikeCnt(postLike.getPost().getLikeCnt() - 1);
            postLikeRepository.save(postLike);
        }
    }

    // 좋아요 사용자 검증
    private void likesValid(PostLike postLike, User user) {
        int postLikedUserId = postLike.getUser().getId();
        int loginId = user.getId();
        if (postLikedUserId != loginId) {
            throw new IllegalArgumentException("잘못된 접근입니다.");
        }
    }

    // 제목 또는 내용으로 검색
    public Page<Post> searchPostsByTitleOrContent(String keyword, Pageable pageable) {
        return postRepository.findByTitleOrContent(keyword, pageable);
    }

    // 제목으로만 검색
    public Page<Post> searchPostsByTitle(String keyword, Pageable pageable) {
        return postRepository.findByTitle(keyword, pageable);
    }

    // 내용으로만 검색
    public Page<Post> searchPostsByContent(String keyword, Pageable pageable) {
        return postRepository.findByContent(keyword, pageable);
    }
}
