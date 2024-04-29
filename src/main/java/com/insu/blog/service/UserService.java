package com.insu.blog.service;

import com.insu.blog.dto.request.SignupRequestDto;
import com.insu.blog.dto.request.UpdateUserRequestDto;
import com.insu.blog.entity.RoleType;
import com.insu.blog.entity.User;
import com.insu.blog.repository.UserRepository;
import com.insu.blog.security.service.PrincipalDetails;
import io.micrometer.common.util.StringUtils;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserService {

    private final BCryptPasswordEncoder encoder;
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final RedisTemplate<String, Object> redisTemplate;
    private final HttpServletResponse servletRes;

    // 회원 가입
    @Transactional
    public void signup(SignupRequestDto signupRequestDto) {
        User signupUser = new User(signupRequestDto.getUsername(), encoder.encode(signupRequestDto.getPassword()), signupRequestDto.getEmail(), RoleType.ROLE_USER);
        userRepository.save(signupUser);
    }

    // 회원 찾기
    @Transactional(readOnly = true)
    public User findUser(String username) {
        return userRepository.findByUsername(username).orElseGet(User::new);
    }

    // 회원 수정
    @Transactional
    public void updateUser(UpdateUserRequestDto updateDto, PrincipalDetails principalDetails) {
        User updateUser = userRepository.findById(principalDetails.getUser().getId()).orElseThrow(() -> new IllegalArgumentException("회원 찾기 실패")
        );
        if( updateUser.getOauth() == null || updateUser.getOauth().equals("")) {
            updateUser.setPassword(encoder.encode(updateDto.getPassword()));
            updateUser.setEmail(updateDto.getEmail());
        }
    }

    // 회원 수정 시 인증 객체 생성
    public void authenticationUser(UpdateUserRequestDto updateDto, PrincipalDetails principalDetails) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(principalDetails.getUser().getUsername(), updateDto.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    // 로그아웃
    public void logout(PrincipalDetails userDetails, String token) throws IOException {

        String username = userDetails.getUsername();
        String refreshKey = "refresh_" + username;

        if (StringUtils.isNotBlank(token)) {
            redisTemplate.delete(refreshKey);

            String script = "localStorage.removeItem('access_token');";
            servletRes.setContentType("application/javascript");
            servletRes.getWriter().write(script);
        }
    }

    // 회원탈퇴
    public void withdrawUser(PrincipalDetails userDetails, String token) throws IOException {

        String username = userDetails.getUsername();
        String refreshKey = "refresh_" + username;

        if (StringUtils.isNotBlank(token)) {
            redisTemplate.delete(refreshKey);

            String script = "localStorage.removeItem('access_token');";
            servletRes.setContentType("application/javascript");
            servletRes.getWriter().write(script);
        }

        userRepository.delete(userDetails.getUser());
    }
}
