package com.insu.blog.dto.response;


import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class KakaoUserInfoResponseDto {
    private String id;
    private String nickname;
}
