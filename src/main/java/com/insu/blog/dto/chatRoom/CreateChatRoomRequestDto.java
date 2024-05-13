package com.insu.blog.dto.chatRoom;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CreateChatRoomRequestDto {
    private String chatRoomName;
    private List<ChatMemberIdDto> memberIdList;
}
