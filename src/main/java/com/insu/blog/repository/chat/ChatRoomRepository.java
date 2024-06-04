package com.insu.blog.repository.chat;

import com.insu.blog.entity.chat.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Integer> {
    ChatRoom findById(Long roomId);
}
