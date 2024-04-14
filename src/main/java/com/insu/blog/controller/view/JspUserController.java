package com.insu.blog.controller.view;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

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

}
