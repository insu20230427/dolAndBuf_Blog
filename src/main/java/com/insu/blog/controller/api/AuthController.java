package com.insu.blog.controller.api;

import com.insu.blog.dto.response.ApiResponseDto;
import com.insu.blog.entity.User;
import com.insu.blog.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<ApiResponseDto> signup(@RequestBody User user) {
        userService.signup(user);
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("회원가입 성공!").build());
    }
}
