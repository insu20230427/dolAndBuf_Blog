package com.insu.blog.repository;

import com.insu.blog.dto.request.ReplyRequestDto;
import com.insu.blog.entity.Reply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReplyRepository extends JpaRepository<Reply, Integer> {

    @Modifying
    @Query(value = "insert into reply(user_id, post_id, content, createDate) VALUES(?1,?2,?3,now())", nativeQuery = true)
    void msave(int userId, int postId, String content); // insert, delete, update 시 업뎃 된 행의 갯수를 리턴

    @Modifying
    @Query(value = "UPDATE reply SET content = ?2 WHERE id = ?1", nativeQuery = true)
    void mupdate(int replyId, String content);

    List<Reply> findByPostId(Integer postId);

    List<Reply> findAllByUserId(int userId);
}
