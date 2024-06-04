package com.insu.blog.service;

import com.insu.blog.dto.request.CommentReplyRequestDto;
import com.insu.blog.dto.request.ReplyRequestDto;
import com.insu.blog.entity.CommentReply;
import com.insu.blog.repository.CommentReplyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class CommentReplyService {
    private final CommentReplyRepository commentReplyRepository;

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
}
