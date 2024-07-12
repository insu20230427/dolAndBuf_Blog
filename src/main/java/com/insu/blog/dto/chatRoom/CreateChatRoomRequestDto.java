package com.insu.blog.dto.chatRoom;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateChatRoomRequestDto {
    private String chatRoomName;
    private String nickname;
}
