package com.insu.blog.controller.api.OAuth2;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.insu.blog.service.KakaoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Slf4j
@Controller
@RequiredArgsConstructor
public class KakaoLoginController {

    private final KakaoService kakaoService;
    @GetMapping("/api/oauth2/kakao/callback")
    public String kakaoLogin(@RequestParam("code") String code) throws JsonProcessingException {
        kakaoService.processKakaoUser(code);
        return "redirect:/";
    }
}
