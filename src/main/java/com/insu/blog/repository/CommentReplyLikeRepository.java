package com.insu.blog.repository;

import com.insu.blog.entity.CommentReplyLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommentReplyLikeRepository extends JpaRepository<CommentReplyLike, Integer> {
    Optional<CommentReplyLike> findByCommentReplyIdAndUserId(int commentId, int userId);
}
