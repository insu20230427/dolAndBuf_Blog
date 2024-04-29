package com.insu.blog.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.insu.blog.dto.response.NaverUseInfoResponseDto;
import com.insu.blog.dto.response.TokenResponseDto;
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

        // 액세스 토큰 받기
        String accessToken = getAccessToken(code);

        // 네이버 유저 정보 받기
        NaverUseInfoResponseDto naverUserInfo = getUserInfo(accessToken);

        // 카카오 유저 필요에 따른 회원가입
        UsernameAndPasswordDto Needauthentication = naverSignup(naverUserInfo);

        authenticationNaverUser(Needauthentication);

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
        params.add("client_secret", client_secret);
        params.add("code", code);

        // header와 body를 하나의 객체로 만듬
        HttpEntity<MultiValueMap<String, String>> naverAccessTokenRequest = new HttpEntity<>(params, headers);

        // String값의 액세스 토큰을 해당 주소에 요청하여 반환받기
        ResponseEntity<String> response = rt.exchange(
                "https://nid.naver.com/oauth2.0/token",
                HttpMethod.POST,
                naverAccessTokenRequest,
                String.class
        );

        ObjectMapper objectMapper = new ObjectMapper();

        return objectMapper.readTree(response.getBody()).get("access_token").asText();
    }

    public NaverUseInfoResponseDto getUserInfo(String accessToken) throws JsonProcessingException {

        RestTemplate rt = new RestTemplate();

        // header
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
        headers.add("Authorization", "Bearer " + accessToken);


        // header 생성
        HttpEntity<MultiValueMap<String, String>> naverAccessTokenRequest = new HttpEntity<>(headers);

        // String값의 액세스 토큰을 해당 주소에 요청하여 반환받기
        ResponseEntity<String> response = rt.exchange(
                "https://openapi.naver.com/v1/nid/me",
                HttpMethod.GET,
                naverAccessTokenRequest,
                String.class
        );


        ObjectMapper objectMapper = new ObjectMapper();

        String id = objectMapper.readTree(response.getBody()).get("response").get("id").asText();
        String nickname = objectMapper.readTree(response.getBody()).get("response").get("name").asText();
        String email = objectMapper.readTree(response.getBody()).get("response").get("email").asText();

        return NaverUseInfoResponseDto.builder()
                .id(id)
                .nickname(nickname)
                .email(email).build();
    }

    // 필요시에 회원가입하는 메서드
    // 인증정보를 가진 사람, 안 가진 사람 모두 대조할거면 디코딩된 비밀번호를 전달하자. */
    public UsernameAndPasswordDto naverSignup(NaverUseInfoResponseDto naverUserInfo) {

        String naverUsername = naverUserInfo.getId() + "_naver";
        String naverEmail = naverUserInfo.getEmail() + "_naver";
        String naverPassword = keyPassword + "_naver";

        User originalUser = userService.findUser(naverUsername);

        if (originalUser.getUsername() == null) {
            log.info("네이버 유저 회원가입 진행");
            User naverUser = new User(naverUsername, naverPassword, naverEmail, "naver");
            naverUser.setPassword(passwordEncoder.encode(naverPassword));
            naverUser.setRole(RoleType.ROLE_USER);

            oAuth2Repository.save(naverUser);

            log.info("네이버 유저 회원가입 완료");
        }

        return UsernameAndPasswordDto.builder()
                .username(naverUsername)
                .password(naverPassword)
                .build();
    }

    public void authenticationNaverUser(UsernameAndPasswordDto resDto) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(resDto.getUsername(), resDto.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 토큰 생성
        String accessToken = authService.generateTokens(resDto.getUsername());

        // Response 객체의 헤더에 액세스/리프레시 토큰 및, Header KEY 값 추가 및 HttpServletResponse 셋팅
        servletRes.addHeader(JwtUtil.AUTHORIZATION_HEADER, accessToken);
        servletRes.setContentType("application/json");
        servletRes.setCharacterEncoding("UTF-8");
    }
}

