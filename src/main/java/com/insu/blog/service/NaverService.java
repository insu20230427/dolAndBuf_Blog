package com.insu.blog.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.insu.blog.dto.response.NaverUseInfoResponseDto;
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
public class NaverService {

    @Value("${naver.client.id}")
    private String client_id;

    @Value("${naver.client.secret}")
    private String client_secret;

    @Value("${insu.key}")
    private String keyPassword;

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final BCryptPasswordEncoder passwordEncoder;
    private final OAuth2Repository oAuth2Repository;
    private final AuthService authService;
    private final HttpServletResponse servletRes;

    public void processNaverUser(String code) throws JsonProcessingException {
        log.info("processNaverUser");
        log.info(code);

        // 액세스 토큰 받기
        String accessToken = getAccessToken(code);

        // 네이버 유저 정보 받기
        NaverUseInfoResponseDto naverUserInfo = getUserInfo(accessToken);

        // 네이버 유저 필요에 따른 회원가입
        UsernameAndPasswordDto needAuthentication = naverSignup(naverUserInfo);

        authenticationNaverUser(needAuthentication);
    }

    public String getAccessToken(String code) throws JsonProcessingException {
        log.info("getAccessToken");

        RestTemplate rt = new RestTemplate();

        // header
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        // body
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", client_id);
        params.add("client_secret", client_secret);
        params.add("code", code);

        // header와 body를 하나의 객체로 만듬
        HttpEntity<MultiValueMap<String, String>> naverAccessTokenRequest = new HttpEntity<>(params, headers);

        // String값의 액세스 토큰을 해당 주소에 요청하여 반환받기
        ResponseEntity<String> response = rt.exchange(
                "https://nid.naver.com/oauth2.0/token",
                HttpMethod.POST,
                naverAccessTokenRequest,
                String.class);

        ObjectMapper objectMapper = new ObjectMapper();
        log.info(objectMapper.readTree(response.getBody()).toString());

        log.info(objectMapper.readTree(response.getBody()).get("access_token").asText());
        log.info(objectMapper.readTree(response.getBody()).toString());

        return objectMapper.readTree(response.getBody()).get("access_token").asText();
    }

    public NaverUseInfoResponseDto getUserInfo(String accessToken) throws JsonProcessingException {
        log.info("getUserInfo");

        RestTemplate rt = new RestTemplate();

        // header
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
        headers.add("Authorization", "Bearer " + accessToken);

        // header 생성
        HttpEntity<MultiValueMap<String, String>> naverUserInfoRequest = new HttpEntity<>(headers);

        // String값의 액세스 토큰을 해당 주소에 요청하여 반환받기
        ResponseEntity<String> response = rt.exchange(
                "https://openapi.naver.com/v1/nid/me",
                HttpMethod.GET,
                naverUserInfoRequest,
                String.class);

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode responseJson = objectMapper.readTree(response.getBody()).get("response");

        log.info("Naver API Response: " + response.getBody()); // 로그 추가

        if (responseJson == null) {
            throw new RuntimeException("Invalid response from Naver API");
        }

        String id = getNodeText(responseJson, "id");
        String nickname = getNodeText(responseJson, "nickname", "unknown_nickname");
        String email = getNodeText(responseJson, "email", "unknown_email");

        return NaverUseInfoResponseDto.builder()
                .id(id)
                .nickname(nickname)
                .email(email).build();
    }

    private String getNodeText(JsonNode node, String fieldName) {
        log.info("getNodeText");
        JsonNode fieldNode = node.get(fieldName);
        if (fieldNode == null) {
            log.warn("Missing field in Naver response: " + fieldName); // 로그 추가
            return null;
        }
        return fieldNode.asText();
    }

    private String getNodeText(JsonNode node, String fieldName, String defaultValue) {
        log.info("getNodeText 인자3");

        JsonNode fieldNode = node.get(fieldName);
        if (fieldNode == null) {
            log.warn("Missing field in Naver response: " + fieldName); // 로그 추가
            return defaultValue;
        }
        return fieldNode.asText();
    }

    public UsernameAndPasswordDto naverSignup(NaverUseInfoResponseDto naverUserInfo) {
        log.info("naverSignup");

        String naverUsername = naverUserInfo.getId() + "_naver";
        String naverEmail = naverUserInfo.getEmail() + "_naver";
        String naverPassword = keyPassword + "_naver";

        User originalUser = userService.findUser(naverUsername);

        if (originalUser == null || originalUser.getUsername() == null) {
            log.info("네이버 유저 회원가입 진행");
            User naverUser = new User(naverUsername, naverPassword, naverEmail, "naver");
            naverUser.setPassword(passwordEncoder.encode(naverPassword));
            naverUser.setRole(RoleType.ROLE_USER);
            naverUser.setNickname(naverUserInfo.getNickname());

            oAuth2Repository.save(naverUser);

            log.info("네이버 유저 회원가입 완료");
        }

        return UsernameAndPasswordDto.builder()
                .username(naverUsername)
                .password(naverPassword)
                .build();
    }

    public void authenticationNaverUser(UsernameAndPasswordDto resDto) {
        log.info("authenticationNaverUser");
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(resDto.getUsername(), resDto.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 토큰 생성
        String accessToken = authService.generateTokens(resDto.getUsername());

        String encodedValue = URLEncoder.encode(accessToken, StandardCharsets.UTF_8).replace("+", "%20");
        Cookie cookie = new Cookie(JwtUtil.AUTHORIZATION_HEADER, encodedValue);
        cookie.setPath("/");
        cookie.setMaxAge(1800);

        // 클라이언트로 쿠키 전송
        servletRes.addCookie(cookie);
    }
}
