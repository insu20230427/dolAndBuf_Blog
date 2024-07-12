package com.insu.blog.dto.chatRoom;

import com.insu.blog.entity.chat.ChatUser;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ChatMemberInfoDto {
    private int userId;
    private String username;
    private String nickname;

    public ChatMemberInfoDto(ChatUser chatUser) {
        this.userId = chatUser.getUser().getId();
        this.username = chatUser.getUser().getUsername();
        this.nickname = chatUser.getUser().getNickname();
    }
}
