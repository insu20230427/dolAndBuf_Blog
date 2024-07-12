package com.insu.blog.controller.api;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.insu.blog.dto.request.BannerRequestDto;
import com.insu.blog.dto.request.UpdateUserRequestDto;
import com.insu.blog.dto.response.ApiResponseDto;
import com.insu.blog.entity.User;
import com.insu.blog.security.service.PrincipalDetails;
import com.insu.blog.service.UserService;
import com.insu.blog.validator.CheckUpdateValidator;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

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
    public ResponseEntity<ApiResponseDto> updateUser(@Valid @RequestBody UpdateUserRequestDto updateDto,
            @AuthenticationPrincipal PrincipalDetails principalDetails) {
        userService.updateUser(updateDto, principalDetails);
        userService.authenticationUser(updateDto, principalDetails);
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("회원정보 수정 성공!").build());
    }

    // 로그아웃
    @PostMapping("/users/logout")
    public ResponseEntity<ApiResponseDto> logout(@AuthenticationPrincipal PrincipalDetails userDetails,
            @RequestHeader("Authorization") String token) throws IOException {
        userService.logout(userDetails, token);
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("로그아웃 성공!").build());
    }

    // 계정탈퇴
    @DeleteMapping("/users/withdraw")
    public ResponseEntity<ApiResponseDto> withdrawAccount(@AuthenticationPrincipal PrincipalDetails userDetails,
            @RequestHeader("Authorization") String token) throws IOException {
        userService.withdrawUser(userDetails, token);
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("계정탈퇴 성공!").build());
    }

    // 블로그이름으로 id 가져오기
    @GetMapping("/blogs")
    public ResponseEntity<ApiResponseDto> getUserIdByBlogName(@RequestParam("blogName") String blogName) {
        User user = userService.findByBlogName(blogName);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .body(ApiResponseDto.builder().message("해당 블로그 회원ID 조회 성공!").data(user.getId()).build());
    }

    @GetMapping("/banners")
    public ResponseEntity<ApiResponseDto> getBannerByPrincipal(
            @AuthenticationPrincipal PrincipalDetails principalDetails) {
        User user = userService.findByPrincipalForBanner(principalDetails);
        if (user == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponseDto.builder().message("로그인 사용자의 배너조회 실패").build());
        }
        return ResponseEntity.ok()
                .body(ApiResponseDto.builder().message("로그인 사용자의 배너조회 성공!").data(user).build());
    }

    @GetMapping("/banners/{blogName}")
    public ResponseEntity<ApiResponseDto> getBannerByBlogName(
            @PathVariable("blogName") String blogName) {
        User user = userService.findByBlogNameForBanner(blogName);
        if (user == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponseDto.builder().message("blogName에 해당하는 배너 배너조회 실패").build());
        }
        return ResponseEntity.ok()
                .body(ApiResponseDto.builder().message("blogName에 해당하는 배너조회 성공!").data(user).build());
    }

    @PostMapping("/banners")
    public ResponseEntity<ApiResponseDto> createBanner(@AuthenticationPrincipal PrincipalDetails principalDetails,
            @RequestBody BannerRequestDto bannerRequest) {
        User user = userService.createBanner(principalDetails, bannerRequest);
        if (user == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponseDto.builder().message("배너 생성 실패").build());
        }
        return ResponseEntity.ok()
                .body(ApiResponseDto.builder().message("배너 생성 성공").data(user).build());
    }
}
