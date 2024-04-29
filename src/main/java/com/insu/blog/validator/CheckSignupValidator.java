package com.insu.blog.validator;

import com.insu.blog.dto.request.SignupRequestDto;
import com.insu.blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;

@RequiredArgsConstructor
@Component
public class CheckSignupValidator extends AbstractValidator<SignupRequestDto> {

    private final UserRepository userRepository;
    @Override
    protected void doValidate(SignupRequestDto dto, Errors errors) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            errors.rejectValue("email", "이메일 중복 오류", "다른 사용자가 이미 사용중인 이메일 입니다.");
        }

        if (userRepository.existsByUsername(dto.getUsername())) {
            errors.rejectValue("username", "아이디 중복 오류", "다른 사용자가 이미 사용중인 아이디 입니다.");
        }
    }
}

