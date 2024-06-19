package com.insu.blog.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.insu.blog.dto.request.SignupRequestDto;
import com.insu.blog.dto.request.UpdateUserRequestDto;
import com.insu.blog.entity.RoleType;
import com.insu.blog.entity.User;
import com.insu.blog.repository.UserRepository;
import com.insu.blog.security.jwt.JwtUtil;
import com.insu.blog.security.service.PrincipalDetails;

import io.micrometer.common.util.StringUtils;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserService {

    private final BCryptPasswordEncoder encoder;
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final RedisTemplate<String, Object> redisTemplate;
    private final HttpServletResponse servletRes;
    private final AuthService authService;

    // 회원 가입
    @Transactional
    public void signup(SignupRequestDto signupRequestDto) {
        User signupUser = new User(
                signupRequestDto.getUsername(),
                encoder.encode(signupRequestDto.getPassword()),
                signupRequestDto.getEmail(),
                RoleType.ROLE_USER,
                signupRequestDto.getNickname()
        );

        // Decode Base64 encoded image
        String base64Image = signupRequestDto.getAvatarImage().split(",")[1];
        byte[] imageBytes = Base64.getDecoder().decode(base64Image);

        // Save image to disk
        String avatarDirectoryPath = "src/main/front/public/images/";
        String avatarFileName = signupUser.getNickname() + ".jpg";
        String avatarPath = avatarDirectoryPath + avatarFileName;

        try {
            // 디렉토리가 존재하지 않으면 생성
            File directory = new File(avatarDirectoryPath);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // 이미지 저장
            try (OutputStream stream = new FileOutputStream(avatarPath)) {
                stream.write(imageBytes);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        // Set avatar image path
        signupUser.setAvatarImage(avatarPath);
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
        User updateUser = userRepository.findById(principalDetails.getUser().getId())
                .orElseThrow(() -> new IllegalArgumentException("회원 찾기 실패"));
        if (updateUser.getOauth() == null || updateUser.getOauth().equals("")) {
            if (StringUtils.isNotBlank(updateDto.getPassword())) {
                updateUser.setPassword(encoder.encode(updateDto.getPassword()));
            }
            updateUser.setEmail(updateDto.getEmail());
        }
    }

    // 회원 수정 시 인증 객체 생성
    public void authenticationUser(UpdateUserRequestDto updateDto, PrincipalDetails principalDetails) {

        if (StringUtils.isNotBlank(updateDto.getPassword())) {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(principalDetails.getUser().getUsername(),
                            updateDto.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } else {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(principalDetails.getUser().getUsername(), null,
                            principalDetails.getAuthorities()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        // AccessToken과 RefreshToken 생성
        String accessToken = authService.generateTokens(updateDto.getUsername());

        String encodedValue = URLEncoder.encode(accessToken, StandardCharsets.UTF_8).replace("+", "%20");
        Cookie cookie = new Cookie(JwtUtil.AUTHORIZATION_HEADER, encodedValue);
        cookie.setPath("/");
        cookie.setMaxAge(1800);

        servletRes.addCookie(cookie);
        servletRes.setContentType("application/json");
        servletRes.setCharacterEncoding("UTF-8");

    }

    // 로그아웃
    public void logout(PrincipalDetails userDetails, String token) throws IOException {

        String username = userDetails.getUsername();
        String refreshKey = "refresh_" + username;

        if (StringUtils.isNotBlank(token)) {
            redisTemplate.delete(refreshKey);
        }
    }

    // 회원탈퇴
    public void withdrawUser(PrincipalDetails userDetails, String token) throws IOException {

        String username = userDetails.getUsername();
        String refreshKey = "refresh_" + username;

        if (StringUtils.isNotBlank(token)) {
            redisTemplate.delete(refreshKey);
        }

        userRepository.delete(userDetails.getUser());
    }

    // 회원아이디로 blogName 가져오기
    public User findByBlogName(String blogName) {
        return userRepository.findByBlogName(blogName);
    }

}
