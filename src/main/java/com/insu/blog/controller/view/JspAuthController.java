package com.insu.blog.controller.view;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/view/auth")
public class JspAuthController {
    @GetMapping("/signupForm")
    public String joinForm() {
        return "user/signupForm";
    }

    @GetMapping("/loginForm")
    public String loginForm() {
        return "user/loginForm";
    }

    @GetMapping("/find-passwordForm")
    public String findPasswordForm() {
        return "user/find-passwordForm";
    }

    @GetMapping("/find-usernameForm")
    public String findUsernameForm() {
        return "user/find-usernameForm";
    }


}
