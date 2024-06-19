package com.insu.blog.dto.chatRoom;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class NicknameListDto {
    private List<ChatNicknameDto> nicknameList;

    public NicknameListDto(List<ChatNicknameDto> nicknameList) {
        this.nicknameList = nicknameList;
    }
}
