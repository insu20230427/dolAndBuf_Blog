package com.insu.blog.controller.api;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {

//    private final UserService userService;


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
