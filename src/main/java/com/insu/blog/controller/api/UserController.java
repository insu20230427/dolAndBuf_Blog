package com.insu.blog.controller.api;

import com.insu.blog.dto.request.UpdateUserRequestDto;
import com.insu.blog.dto.response.ApiResponseDto;
import com.insu.blog.security.service.PrincipalDetails;
import com.insu.blog.service.UserService;
import com.insu.blog.validator.CheckUpdateValidator;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;
    private final CheckUpdateValidator checkUpdateValidator;

    // InitBinder를 사용하여 Validator를 등록
    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.addValidators(checkUpdateValidator);
    }

    // 회원 수정
    @PutMapping("/users")
    public ResponseEntity<ApiResponseDto> updateUser(@Valid @RequestBody UpdateUserRequestDto updateDto, @AuthenticationPrincipal PrincipalDetails principalDetails) throws IOException {
        userService.updateUser(updateDto, principalDetails);
        userService.authenticationUser(updateDto, principalDetails);
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("회원정보 수정 성공!").build());
    }

    //로그아웃
    @PostMapping("/users/logout")
    public ResponseEntity<ApiResponseDto> logout(@AuthenticationPrincipal PrincipalDetails userDetails, @RequestHeader("Authorization") String token) throws IOException {
        userService.logout(userDetails, token);
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("로그아웃 성공!").build());
        }


    // 계정탈퇴
    @DeleteMapping("/users/withdraw")
    public ResponseEntity<ApiResponseDto> withdrawAccount(@AuthenticationPrincipal PrincipalDetails userDetails, @RequestHeader("Authorization") String token) throws IOException {
         userService.withdrawUser(userDetails, token);
         return ResponseEntity.ok().body(ApiResponseDto.builder().message("계정탈퇴 성공!").build());
    }
}
