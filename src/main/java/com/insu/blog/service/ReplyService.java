package com.insu.blog.service;

import com.insu.blog.dto.request.AdminReplysRequestDto;
import com.insu.blog.dto.request.ReplyRequestDto;
import com.insu.blog.entity.*;
import com.insu.blog.repository.PostRepository;
import com.insu.blog.repository.ReplyLikeRepository;
import com.insu.blog.repository.ReplyRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ReplyService {

    private final ReplyRepository replyRepository;
    private final ReplyLikeRepository replyLikeRepository;
    private final PostRepository postRepository;

    public List<Reply> getReply(String postId) {
        return replyRepository.findByPostId(Integer.valueOf(postId));
    }

    // 유저에 따른 댓글 불러오기
    // 유저가 쓴 포스트에 달린 댓글들 가져오기 (admin)
    @Transactional
    public Page<AdminReplysRequestDto> getRepliesByUserPosts(Pageable pageable, int userId) {
        Page<Post> postsPage = postRepository.findAllByUserId(pageable, userId);
        List<Post> posts = postsPage.getContent();
        List<Reply> replies = posts.stream()
                .flatMap(post -> post.getReplyList().stream())
                .collect(Collectors.toList());

        List<AdminReplysRequestDto> replyDtos = replies.stream().map(reply -> {
            AdminReplysRequestDto dto = new AdminReplysRequestDto();
            dto.setId(reply.getId());
            dto.setUser(reply.getUser());
            dto.setPost(reply.getPost());
            dto.setContent(reply.getContent());
            dto.setCreateDate(reply.getCreateDate().toString());
            return dto;
        }).collect(Collectors.toList());

        return new PageImpl<>(replyDtos, pageable, replies.size());
    }

    @Transactional
    public void writeReply(ReplyRequestDto reqDto) {
        replyRepository.msave(reqDto.getUserId(), reqDto.getPostId(), reqDto.getContent());
    }

    @Transactional
    public void deleteReply(int replyId) {
        replyRepository.deleteById(replyId);
    }

    @Transactional
    public void updateReply(int replyId, ReplyRequestDto reqDto) {
        replyRepository.mupdate(replyId, reqDto.getContent());
    }

    // 댓글 좋아요
    public void createLikes(int replyId, User user) {

        Optional<ReplyLike> existingLikesOptional = replyLikeRepository.findByReplyIdAndUserId(replyId, user.getId());
        if (!existingLikesOptional.isPresent()) { // 좋아요를 한번도 누르지 않은 사람
            Reply reply = replyRepository.findById(replyId)
                    .orElseThrow(() -> new IllegalArgumentException("해당 댓글이 존재하지 않습니다."));

            ReplyLike newLikes = new ReplyLike(true, reply, user);
            reply.setLikeCnt(reply.getLikeCnt() + 1);
            replyLikeRepository.save(newLikes);
        } else { // 좋아요를 눌러본 사람
            ReplyLike existingLikes = existingLikesOptional.get();

            if (!existingLikes.isLikes()) { // 좋아요를 취소한 경우 = likes가 false인 경우
                existingLikes.setLikes(true);
                existingLikes.getReply().setLikeCnt(existingLikes.getReply().getLikeCnt() + 1);
                replyLikeRepository.save(existingLikes);
            } else { // 좋아요를 이미 누른 경우 = likes가 true인 경우
                throw new IllegalArgumentException("이미 좋아요를 눌렀습니다.");
            }
        }
    }

    // 댓글 좋아요 취소
    public void deleteLikes(int replyId, User user) {

        ReplyLike replyLike = replyLikeRepository.findByReplyIdAndUserId(replyId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("해당 댓글의 좋아요가 존재하지 않습니다."));

        likesValid(replyLike, user);

        if (!replyLike.isLikes()) { // 좋아요를 취소한 경우 = likes가 false인 경우
            throw new IllegalArgumentException("이미 좋아요를 취소했습니다.");
        } else { // 좋아요를 이미 누른 경우
            replyLike.setLikes(false);
            replyLike.getReply().setLikeCnt(replyLike.getReply().getLikeCnt() - 1);
            replyLikeRepository.save(replyLike);
        }
    }

    // 좋아요 사용자 검증
    private void likesValid(ReplyLike replyLike, User user) {
        int replyLikedUserId = replyLike.getUser().getId();
        int loginId = user.getId();
        if (replyLikedUserId != loginId) {
            throw new IllegalArgumentException("잘못된 접근입니다.");
        }
    }
}
