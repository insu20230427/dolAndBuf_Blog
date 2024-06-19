package com.insu.blog.entity.chat;

import com.insu.blog.dto.chat.ChatMessageDto;
import com.insu.blog.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int chatId;

    @Column(nullable = false)
    private int senderId;

    @Column(nullable = false)
    private String senderNickname;

    @Column
    private String message;

    @Column
    private String imgUrl;

    @Column
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "chatroom_id")
    private ChatRoom chatRoom;

    @Column
    private String username;

    public ChatMessage(User user, ChatMessageDto chatMessageDto) {
        this.senderId = user.getId();
        this.username = user.getUsername();
//        this.senderNickname = user.getNickname();
        this.senderNickname = user.getNickname();
        if(chatMessageDto.getMessage() != null) {
            this.message = chatMessageDto.getMessage();
        }
        if(chatMessageDto.getImgData() != null) {
            this.imgUrl = chatMessageDto.getImgData();
        }
        this.createdAt = LocalDateTime.now();
    }
}
