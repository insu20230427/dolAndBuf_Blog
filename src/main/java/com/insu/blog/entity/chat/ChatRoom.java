package com.insu.blog.entity.chat;

import com.insu.blog.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Table(name = "chatroom")
@NoArgsConstructor
public class ChatRoom {

    @Id
    @GeneratedValue
    private int id;

    @Column(nullable = false)
    private String chatRoomName;

    @Column(nullable = false)
    private String hostNickname;

    public ChatRoom(String hostNickname, String chatRoomName) {
        this.chatRoomName = chatRoomName;
        this.hostNickname = hostNickname;
    }

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatUser> chatUserList = new ArrayList<>();

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatMessage> chatMessageList = new ArrayList<>();

    public void updateChatRoomName(String newChatRoomName) {
        this.chatRoomName = newChatRoomName;
    }
}
