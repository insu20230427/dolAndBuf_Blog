package com.insu.blog.repository;

import com.insu.blog.entity.CommentReply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CommentReplyRepository extends JpaRepository<CommentReply, Integer> {
    List<CommentReply> findByReplyId(Integer replyId);

    @Modifying
    @Query(value = "INSERT INTO commentreply (user_id, post_id, reply_id, content, createDate) VALUES (?1, ?2, ?3, ?4, NOW())", nativeQuery = true)
    void saveCommentReply(int userId, int postId, int replyId, String content);

    @Modifying
    @Query(value = "UPDATE commentreply SET content = ?2 WHERE id = ?1", nativeQuery = true)
    void updateCommentReply(int commentId, String content);
}
