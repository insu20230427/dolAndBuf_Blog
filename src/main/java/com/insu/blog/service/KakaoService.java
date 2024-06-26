package com.insu.blog.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.insu.blog.dto.response.KakaoUserInfoResponseDto;
import com.insu.blog.dto.response.UsernameAndPasswordDto;
import com.insu.blog.entity.RoleType;
import com.insu.blog.entity.User;
import com.insu.blog.repository.OAuth2Repository;
import com.insu.blog.security.jwt.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Slf4j
@RequiredArgsConstructor
@Service
public class KakaoService {

    @Value("${kakao.client.id}")
    private String client_id;

    @Value("${insu.key}")
    private String keyPassword;

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final BCryptPasswordEncoder passwordEncoder;
    private final OAuth2Repository oAuth2Repository;
    private final AuthService authService;
    private final HttpServletResponse servletRes;

    public void processKakaoUser(String code) throws JsonProcessingException {

        // 액세스 토큰 받기
        String accessToken = getAccessToken(code);

        // 카카오 유저 정보 받기
        KakaoUserInfoResponseDto kakaUserInfo = getUserInfo(accessToken);

        // 카카오 유저 필요에 따른 회원가입
        UsernameAndPasswordDto Needauthentication = kakaoSignup(kakaUserInfo);

        authenticationKakaoUser(Needauthentication);
    }

    public String getAccessToken(String code) throws JsonProcessingException {

        RestTemplate rt = new RestTemplate();

        // header
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        // body
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", client_id);
        params.add("redirect_uri", "http://localhost:8080/api/oauth2/kakao/callback");
        params.add("code", code);

        // header와 body를 하나의 객체로 만듬
        HttpEntity<MultiValueMap<String, String>> kakaoAccessTokenRequest = new HttpEntity<>(params, headers);

        // String값의 액세스 토큰을 해당 주소에 요청하여 반환받기
        ResponseEntity<String> response = rt.exchange(
                "https://kauth.kakao.com/oauth/token",
                HttpMethod.POST,
                kakaoAccessTokenRequest,
                String.class);

        ObjectMapper objectMapper = new ObjectMapper();

        return objectMapper.readTree(response.getBody()).get("access_token").asText();
    }

    public KakaoUserInfoResponseDto getUserInfo(String accessToken) throws JsonProcessingException {

        RestTemplate rt = new RestTemplate();

        // header
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
        headers.add("Authorization", "Bearer " + accessToken);

        // header 생성
        HttpEntity<MultiValueMap<String, String>> kakaoAccessTokenRequest = new HttpEntity<>(headers);

        // String값의 액세스 토큰을 해당 주소에 요청하여 반환받기
        ResponseEntity<String> response = rt.exchange(
                "https://kapi.kakao.com/v2/user/me",
                HttpMethod.POST,
                kakaoAccessTokenRequest,
                String.class);

        ObjectMapper objectMapper = new ObjectMapper();

        log.info("response : " + response);

        // nickname 추출 및 디코딩
        String nickname = decodeNickname(
                objectMapper.readTree(response.getBody()).get("properties").get("nickname").asText());
        if (nickname.length() > 50) { // nickname 길이 확인 및 잘라내기
            nickname = nickname.substring(0, 50);
        }
        String id = objectMapper.readTree(response.getBody()).get("id").asText();

        return KakaoUserInfoResponseDto.builder()
                .id(id)
                .nickname(nickname)
                .build();
    }

    // 인코딩 문제 해결
    private String decodeNickname(String nickname) {
        try {
            return URLEncoder.encode(nickname, StandardCharsets.UTF_8.toString());
        } catch (Exception e) {
            e.printStackTrace();
            return nickname;
        }
    }

    // 필요시에 회원가입
    // 인증정보를 가진 사람, 안 가진 사람 모두 대조할거면 디코딩된 비밀번호를 전달하자.
    public UsernameAndPasswordDto kakaoSignup(KakaoUserInfoResponseDto kakaoUserInfo) {

        String kakaoUsername = kakaoUserInfo.getId() + "_Kakao";
        String kakaoPassword = keyPassword + "_kakao";

        User originalUser = userService.findUser(kakaoUsername);

        if (originalUser == null || originalUser.getUsername() == null) { // 수정: originalUser가 null인 경우도 확인
            log.info("카카오 유저 회원가입 진행");
            User kakaoUser = new User(kakaoUsername, kakaoPassword, "kakao");
            kakaoUser.setPassword(passwordEncoder.encode(kakaoPassword));
            kakaoUser.setRole(RoleType.ROLE_USER);
            kakaoUser.setNickname(kakaoUserInfo.getNickname()); // 수정: 닉네임 설정

            oAuth2Repository.save(kakaoUser);

            log.info("카카오 유저 회원가입 완료");
        }

        return UsernameAndPasswordDto.builder()
                .username(kakaoUsername)
                .password(kakaoPassword)
                .build();
    }

    public void authenticationKakaoUser(UsernameAndPasswordDto resDto) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(resDto.getUsername(), resDto.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // AccessToken 생성
        String accessToken = authService.generateTokens(resDto.getUsername());

        String encodedValue = URLEncoder.encode(accessToken, StandardCharsets.UTF_8).replace("+", "%20");
        Cookie cookie = new Cookie(JwtUtil.AUTHORIZATION_HEADER, encodedValue);
        cookie.setPath("/");
        cookie.setMaxAge(1800);

        // 클라이언트로 쿠키 전송
        servletRes.addCookie(cookie);
    }
}
