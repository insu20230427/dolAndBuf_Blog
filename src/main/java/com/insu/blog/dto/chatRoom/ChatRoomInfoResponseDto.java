package com.insu.blog.dto.chatRoom;

import java.util.List;
import com.insu.blog.entity.chat.ChatRoom;
import lombok.Getter;

@Getter
public class ChatRoomInfoResponseDto {

    private int chatRoomId;
    private String chatRoomName;
    private String hostNickname;
    private List<UserInfoDto> users;

    public ChatRoomInfoResponseDto(ChatRoom chatRoom) {
        this.chatRoomId = chatRoom.getId();
        this.chatRoomName = chatRoom.getChatRoomName();
        this.hostNickname = chatRoom.getHostNickname();
    }

    public ChatRoomInfoResponseDto(ChatRoom chatRoom, List<UserInfoDto> users) {
        this.chatRoomId = chatRoom.getId();
        this.chatRoomName = chatRoom.getChatRoomName();
        this.hostNickname = chatRoom.getHostNickname();
        this.users = users; 
    }
}
