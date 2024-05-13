package com.insu.blog.repository.chat;

import com.insu.blog.entity.User;
import com.insu.blog.entity.chat.ChatRoom;
import com.insu.blog.entity.chat.ChatUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatUserRepository extends JpaRepository<ChatUser, Long> {

    List<ChatUser> findAllByChatRoom(ChatRoom chatRoom);

    List<ChatUser> findAllByUser(User user);

    ChatUser findByChatRoomAndUser(ChatRoom chatRoom, User user);
}
