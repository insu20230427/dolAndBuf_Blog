package com.insu.blog.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class UpdateUserRequestDto {

    @NotBlank(message = "이메일은 필수 입력값입니다.")
    @Email(message = "이메일 형식에 맞지 않습니다.")
    private String email;

    @NotBlank(message = "비밀번호는 필수 입력값입니다. 기존 비밀번호 혹은 새로운 비밀번호를 입력해주세요.")
    @Pattern(regexp = "^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[!-/:-@\\[-`{-~])[A-Za-z\\d!-/:-@\\[-`{-~]{8,16}$",
            message = "비밀번호 형식에 맞지 않습니다. 비밀번호는 영문, 숫자, 특수문자의 조합으로 8~16자리여야 합니다.")
    private String password;

    @NotBlank(message = "닉네임은 필수 입력값입니다. 기존 닉네임 혹은 새로운 닉네임을 입력해주세요.")
    @Pattern(regexp = "^[A-Za-z가-힣\\d!-/:-@\\[-`{-~]{2,8}$",
            message = "닉네임 형식에 맞지 않습니다. 2~8자리의 닉네임을 설정해주세요.")
    private String nickname;

    private String username;

}
