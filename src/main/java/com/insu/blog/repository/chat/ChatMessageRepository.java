package com.insu.blog.repository.chat;

import com.insu.blog.entity.chat.ChatMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Integer> {

    List<ChatMessage> findAllByChatRoomIdAndCreatedAtGreaterThanEqual(Pageable pageable, int chatRoomId, LocalDateTime enteredTime);
}
