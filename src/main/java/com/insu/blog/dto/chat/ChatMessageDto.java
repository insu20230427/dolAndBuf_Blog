package com.insu.blog.dto.chat;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.insu.blog.entity.chat.ChatMessage;
import com.insu.blog.repository.UserRepository;
import lombok.*;

import java.time.format.DateTimeFormatter;

@Getter
@Setter
@RequiredArgsConstructor
public class ChatMessageDto {

    // 메세지 타입 : 입장, 채팅
    public enum MessageType {
        ENTER, TALK, QUIT
    }

    private MessageType type;
    private Long roomId;
    private String sender;  // nickname
    private String message;
    private String imgData;
    private String username;

    @JsonFormat(pattern = "yy-MM-dd HH:mm")
    private String createdAt;

    public ChatMessageDto(ChatMessage chatMessage) {
        this.type = MessageType.TALK;
        this.sender = chatMessage.getSenderNickname();
        this.username = chatMessage.getUsername();

        if(chatMessage.getMessage() != null) {
            this.message = chatMessage.getMessage();
        }
        if(chatMessage.getImgUrl() != null) {
            this.imgData = chatMessage.getImgUrl();
        }
        this.createdAt = chatMessage.getCreatedAt().format(DateTimeFormatter.ofPattern("yy-MM-dd HH:mm"));
    }
}
