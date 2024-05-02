package com.insu.blog.controller.api.OAuth2;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.insu.blog.service.NaverService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@RequiredArgsConstructor
@Controller
public class NaverLoginController {

    private final NaverService naverService;
    @GetMapping("/api/oauth2/naver/callback")
    public String naver(String code) throws JsonProcessingException {
        naverService.processNaverUser(code);
        return "redirect:/";
    }
}
