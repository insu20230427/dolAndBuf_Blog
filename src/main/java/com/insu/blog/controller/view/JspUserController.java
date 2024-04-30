package com.insu.blog.controller.view;

import com.insu.blog.entity.User;
import com.insu.blog.security.service.PrincipalDetails;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

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
    public User info(@AuthenticationPrincipal PrincipalDetails principalDetails) {
        return principalDetails.getUser();
    }
}
