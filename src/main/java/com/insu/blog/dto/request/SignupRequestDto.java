package com.insu.blog.dto.request;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class SignupRequestDto {

    private String realPersonName;

    private String username;

    private String password;

    private String email;

}
