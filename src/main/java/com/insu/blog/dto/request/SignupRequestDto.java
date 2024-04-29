package com.insu.blog.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class SignupRequestDto {

    @NotBlank(message = "아이디는 필수 입력값입니다.")
    @Pattern(regexp = "[a-zA-Z0-9]{5,13}",
            message = "아이디 형식에 맞지 않습니다. 아이디는 영문, 숫자의 조합으로 5 ~ 13자리여야 합니다.")
    private String username;

    @NotBlank(message = "비밀번호는 필수 입력값입니다.")
    @Pattern(regexp = "^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[!-/:-@\\[-`{-~])[A-Za-z\\d!-/:-@\\[-`{-~]{8,16}$",
            message = "비밀번호 형식에 맞지 않습니다. 비밀번호는 영문, 숫자, 특수문자의 조합으로 8~16자리여야 합니다.")
    private String password;

    @NotBlank(message = "이메일은 필수 입력값입니다.")
    @Email(message = "이메일 형식에 맞지 않습니다.")
    private String email;
}
