package com.insu.blog.repository;

import com.insu.blog.entity.ReplyLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReplyLikeRepository extends JpaRepository<ReplyLike, Integer> {
    Optional<ReplyLike> findByReplyIdAndUserId(int replyId, int userId);
}
