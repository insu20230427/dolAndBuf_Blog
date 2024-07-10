package com.insu.blog.repository.chat;

import com.insu.blog.entity.User;
import com.insu.blog.entity.chat.ChatRoom;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Integer> {
    ChatRoom findById(Long roomId);

    @Query("SELECT cr FROM ChatRoom cr JOIN cr.chatUserList cu1 JOIN cr.chatUserList cu2 WHERE cu1.user = :user1 AND cu2.user = :user2")
    Optional<ChatRoom> findChatRoomByUsers(@Param("user1") User user1, @Param("user2") User user2);
}
