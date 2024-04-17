package com.insu.blog.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UsernameAndPasswordDto {
    private String username;
    private String password;
}
