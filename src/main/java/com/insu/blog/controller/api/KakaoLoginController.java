package com.insu.blog.controller.api;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.insu.blog.service.KakaoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Slf4j
@Controller
@RequiredArgsConstructor
public class KakaoLoginController {

    private final KakaoService kakaoService;
    @GetMapping("/api/auth/kakao/callback")
    public String kakaoLogin(String code) throws JsonProcessingException {

        kakaoService.processKakaoUser(code);

        return "redirect:/";
    }
}
