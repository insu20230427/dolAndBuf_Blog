package com.insu.blog.controller.api;

import com.insu.blog.dto.response.ApiResponseDto;
import com.insu.blog.entity.User;
import com.insu.blog.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    // 회원 수정
    @PutMapping("/users")
    public ResponseEntity<ApiResponseDto> updateUser(@RequestBody User user) {
        userService.updateUser(user);
        userService.authenticationUser(user);
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("회원 작성 성공!").build());
    }

//    //로그아웃
//    @PostMapping("/logout")
//    public ResponseEntity<ApiResponseDto> logout(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestHeader("Authorization_ACCESS") String token) {
//        userService.logout(userDetails, token);
//        return ResponseEntity.ok().body(ApiResponseDto.builder().message("로그아웃 성공!").build());
//        }
//
//
//    // 계정탈퇴
//    @DeleteMapping("/withdraw")
//    public ResponseEntity<ApiResponseDto> withdrawAccount(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestHeader("Authorization_ACCESS") String token) {
//         userService.withdrawUser(userDetails, token);
//         return ResponseEntity.ok().body(ApiResponseDto.builder().message("계정탈퇴 성공!").build());
//    }
}
