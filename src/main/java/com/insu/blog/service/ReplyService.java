package com.insu.blog.service;

import com.insu.blog.dto.request.ReplyRequestDto;
import com.insu.blog.entity.Reply;
import com.insu.blog.repository.ReplyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ReplyService {

    private final ReplyRepository replyRepository;

    public List<Reply> getReply(String postId) {
        return replyRepository.findByPostId(Integer.valueOf(postId));
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
}
