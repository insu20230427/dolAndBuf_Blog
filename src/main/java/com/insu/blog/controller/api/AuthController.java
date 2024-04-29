package com.insu.blog.controller.api;

import com.insu.blog.dto.request.SignupRequestDto;
import com.insu.blog.dto.response.ApiResponseDto;
import com.insu.blog.service.UserService;
import com.insu.blog.validator.CheckSignupValidator;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final CheckSignupValidator checkSignupValidator;

    // InitBinder를 사용하여 Validator를 등록
    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.addValidators(checkSignupValidator);
    }

    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<ApiResponseDto> signup(@Valid @RequestBody SignupRequestDto signupRequestDto) {
        userService.signup(signupRequestDto);
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("회원가입 성공").build());
    }
}
