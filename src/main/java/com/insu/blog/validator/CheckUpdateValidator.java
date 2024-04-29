package com.insu.blog.validator;

import com.insu.blog.dto.request.UpdateUserRequestDto;
import com.insu.blog.entity.User;
import com.insu.blog.repository.UserRepository;
import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;

import java.util.Objects;
import java.util.Optional;

@RequiredArgsConstructor
@Component
public class CheckUpdateValidator extends AbstractValidator<UpdateUserRequestDto> {

    private final UserRepository userRepository;

    @Override
    protected void doValidate(UpdateUserRequestDto dto, Errors errors) {
        // 해당 사용자 가져오기
        Optional<User> optionalUser = userRepository.findByUsername(dto.getUsername());

        // 해당 요청 이메일이 해당 유저의 이메일이랑 다른데, 해당 이메일을 가진 다른 유저가 존재한다는 건 이메일이 중복됐다는 걸 의미.
        if (optionalUser.isPresent() && !Objects.equals(dto.getEmail(), optionalUser.get().getEmail()) && userRepository.existsByEmail(dto.getEmail())
        ) {
            errors.rejectValue("email", "이메일 중복 오류", "다른 사용자가 이미 사용하는 이메일 입니다.");
        }

        if (StringUtils.isBlank(dto.getPassword())) {
            errors.rejectValue("password", "비밀번호 공백 오류", "비밀번호는 필수 입력값입니다. 기존 비밀번호 혹은 새로운 비밀번호를 입력해주세요.");
        }
    }
}
