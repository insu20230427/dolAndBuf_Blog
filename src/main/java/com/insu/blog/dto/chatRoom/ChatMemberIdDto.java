package com.insu.blog.dto.chatRoom;

import com.insu.blog.entity.chat.ChatUser;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ChatMemberIdDto {
    private int userId;

    public ChatMemberIdDto(ChatUser chatUser) {
        this.userId = chatUser.getUser().getId();
    }
}
