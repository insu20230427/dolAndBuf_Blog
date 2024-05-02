package com.insu.blog.controller.view;

import com.insu.blog.entity.User;
import com.insu.blog.security.service.PrincipalDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/view/users")
public class JspUserController {

    @GetMapping("/logoutForm")
    public String logoutForm() {
        return "user/logoutForm";
    }

    @GetMapping("/infoForm")
    public String infoForm() {
        return "user/infoForm";
    }

    @GetMapping("/info")
    @ResponseBody
    public User info() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            // 인증되지 않은 경우 처리
            return null;
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof PrincipalDetails) {
            // PrincipalDetails에서 사용자 정보 가져오기
            return ((PrincipalDetails) principal).getUser();
        } else {
            // 다른 타입의 Principal이 반환될 경우 처리
            return null;
        }
    }
}
