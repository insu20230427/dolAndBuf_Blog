package com.insu.blog.dto.chatRoom;
import com.insu.blog.entity.User;
import lombok.Getter;

@Getter
public class UserInfoDto {
    private int userId;
    private String nickname;

    public UserInfoDto(User user) {
        this.userId = user.getId();
        this.nickname = user.getNickname();
    }
}