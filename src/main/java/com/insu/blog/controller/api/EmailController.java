package com.insu.blog.controller.api;

import com.insu.blog.dto.response.ApiResponseDto;
import com.insu.blog.service.EmailService;
import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.concurrent.TimeUnit;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth/send-mail")
public class EmailController {
    private final EmailService emailService;
    private final StringRedisTemplate redisTemplate;

    // 인증코드 발급
    @PostMapping("/code")
    public ResponseEntity<ApiResponseDto> sendCodeMail(@RequestParam("email") String email) {
        String code = emailService.sendCodeMail(email);
        if (StringUtils.isNotBlank(code)) {
            redisTemplate.opsForValue().set(code + "_send-verify-code", code, 3, TimeUnit.MINUTES);
            return ResponseEntity.ok().body(ApiResponseDto.builder().message("인증코드 발송 성공!").data(true).build());
        }
        return ResponseEntity.badRequest().body(ApiResponseDto.builder().message("인증코드 발송 실패").data(false).build());
    }

    // 인증코드 검증
    @PostMapping("/code/verify")
    public ResponseEntity<ApiResponseDto> verifyCode(@RequestParam("code") String code) {
        String validCode = redisTemplate.opsForValue().get(code + "_send-verify-code");
        if (StringUtils.isNotBlank(validCode)) {
            redisTemplate.delete(code + "_send_verify-code");
            return ResponseEntity.ok().body(ApiResponseDto.builder().message("인증코드 검증 성공!").data(true).build());
        } else {
            return ResponseEntity.badRequest().body(ApiResponseDto.builder().message("인증코드 검증 실패").data(false).build());
        }
    }

    // 비밀번호 찾기(임시 비밀번호 발급)
    @PostMapping("/password")
    public ResponseEntity<ApiResponseDto> sendTempPasswordMail(@RequestParam("email") String email) {
        String tempPassword = emailService.sendTempPasswordMail(email);
        if (StringUtils.isNotBlank(tempPassword)) {
            return ResponseEntity.ok().body(ApiResponseDto.builder().message("임시 비밀번호 발급 성공!").data(true).build());
        } else {
            return ResponseEntity.badRequest().body(ApiResponseDto.builder().message("임시 비밀번호 발급 실패").data(false).build());
        }
    }

    // 아이디 찾기
    @PostMapping("/username")
    public ResponseEntity<ApiResponseDto> sendUsernameMail(@RequestParam("email") String email) {
        String username = emailService.sendUsernameMail(email);
        if (StringUtils.isNotBlank(username)) {
            return ResponseEntity.ok().body(ApiResponseDto.builder().message("아이디 찾기 성공!").data(true).build());
        } else {
            return ResponseEntity.badRequest().body(ApiResponseDto.builder().message("아이디 찾기 실패").data(false).build());
        }
    }
}
