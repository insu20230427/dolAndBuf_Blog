package com.insu.blog.dto.chatRoom;

import com.insu.blog.entity.chat.ChatRoom;
import lombok.Getter;

@Getter
public class ChatRoomInfoResponseDto {

    private int chatRoomId;
    private String chatRoomName;
    private String hostNickname;


    public ChatRoomInfoResponseDto(ChatRoom chatRoom) {
        this.chatRoomId = chatRoom.getId();
        this.chatRoomName = chatRoom.getChatRoomName();
        this.hostNickname = chatRoom.getHostNickname();
    }
}
