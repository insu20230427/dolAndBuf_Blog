package com.insu.blog.service;

import com.insu.blog.dto.request.CommentReplyRequestDto;
import com.insu.blog.entity.CommentReply;
import com.insu.blog.entity.CommentReplyLike;
import com.insu.blog.entity.User;
import com.insu.blog.repository.CommentReplyLikeRepository;
import com.insu.blog.repository.CommentReplyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class CommentReplyService {
    private final CommentReplyRepository commentReplyRepository;
    public final CommentReplyLikeRepository commentReplyLikeRepository;

    // 대댓글 조회
    public List<CommentReply> getCommentReply(String replyId) {
        return commentReplyRepository.findByReplyId(Integer.valueOf(replyId));
    }

    // 대댓글 작성
    @Transactional
    public void writeReply(CommentReplyRequestDto req, String postId, String replyId) {
        commentReplyRepository.saveCommentReply(req.getUserId(), Integer.parseInt(postId), Integer.parseInt(replyId), req.getContent());
    }

    // 대댓글 삭제
    @Transactional
    public void deleteReply(String commentId) {
        commentReplyRepository.deleteById(Integer.valueOf(commentId));
    }

    // 대댓글 업데이트
    @Transactional
    public void updateReply(String commentId, CommentReplyRequestDto req) {
        commentReplyRepository.updateCommentReply(Integer.parseInt(commentId), req.getContent());
    }

    // 대댓글 좋아요
    public void createLikes(String commentId, User user) {

        Optional<CommentReplyLike> existingLikesOptional = commentReplyLikeRepository.findByCommentReplyIdAndUserId(Integer.parseInt(commentId), user.getId());
        if (existingLikesOptional.isEmpty()) { // 좋아요를 한번도 누르지 않은 사람
            CommentReply commentReply = commentReplyRepository.findById(Integer.valueOf(commentId)).orElseThrow(() -> new IllegalArgumentException("해당 댓글이 존재하지 않습니다."));

            CommentReplyLike newLikes = new CommentReplyLike(user, commentReply, true);
            commentReply.setLikeCnt(commentReply.getLikeCnt() + 1);
            commentReplyLikeRepository.save(newLikes);
        } else { // 좋아요를 눌러본 사람
            CommentReplyLike existingLikes = existingLikesOptional.get();

            if (!existingLikes.isLikes()) { // 좋아요를 취소한 경우 = likes가 false인 경우
                existingLikes.setLikes(true);
                existingLikes.getCommentReply().setLikeCnt(existingLikes.getCommentReply().getLikeCnt() + 1);
                commentReplyLikeRepository.save(existingLikes);
            } else { // 좋아요를 이미 누른 경우 = likes가 true인 경우
                throw new IllegalArgumentException("이미 좋아요를 눌렀습니다.");
            }
        }
    }

    // 대댓글 좋아요 취소
    public void deleteLikes(String commentId, User user) {

        CommentReplyLike commentReplyLike = commentReplyLikeRepository.findByCommentReplyIdAndUserId(Integer.parseInt(commentId), user.getId()).orElseThrow(() -> new IllegalArgumentException("해당 댓글의 좋아요가 존재하지 않습니다."));

        likesValid(commentReplyLike, user);

        if (!commentReplyLike.isLikes()) { // 좋아요를 취소한 경우 = likes가 false인 경우
            throw new IllegalArgumentException("이미 좋아요를 취소했습니다.");
        } else { // 좋아요를 이미 누른 경우
            commentReplyLike.setLikes(false);
            commentReplyLike.getCommentReply().setLikeCnt(commentReplyLike.getCommentReply().getLikeCnt() - 1);
            commentReplyLikeRepository.save(commentReplyLike);
        }
    }

    // 대댓글 좋아요 사용자 검증
    private void likesValid(CommentReplyLike commentReplyLike, User user) {
        int replyLikedUserId = commentReplyLike.getUser().getId();
        int loginId = user.getId();
        if (replyLikedUserId != loginId) {
            throw new IllegalArgumentException("잘못된 접근입니다.");
        }
    }
}
