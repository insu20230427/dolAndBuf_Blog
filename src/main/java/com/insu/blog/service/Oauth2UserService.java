package com.insu.blog.service;

import com.insu.blog.entity.RoleType;
import com.insu.blog.entity.User;
import com.insu.blog.provider.GoogleUserInfo;
import com.insu.blog.provider.OAuth2UserInfoInterface;
import com.insu.blog.repository.OAuth2Repository;
import com.insu.blog.security.jwt.JwtUtil;
import com.insu.blog.security.service.PrincipalDetails;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Slf4j
@RequiredArgsConstructor
@Service
public class Oauth2UserService extends DefaultOAuth2UserService {

    private final OAuth2Repository oAuth2Repository;
    private final AuthService authService;
    private final HttpServletResponse servletRes;

    @Value("${insu.key}")
    private String keyPassword;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);

        log.info("getAttributes : " + oAuth2User.getAttributes());

        OAuth2UserInfoInterface oAuth2UserInfo = null;

        if (userRequest.getClientRegistration().getRegistrationId().equals("google")) {
            log.info("구글 로그인 요청");
            oAuth2UserInfo = new GoogleUserInfo(oAuth2User.getAttributes());
        } else {
            log.info("로그인 실패");
            throw new OAuth2AuthenticationException("지원하지 않는 로그인 방식입니다.");
        }

        String provider = oAuth2UserInfo.getProvider();
        String providerId = oAuth2UserInfo.getProviderId();

        String username = providerId + "_" + provider;
        String password = keyPassword + "_" + provider;
        String email = oAuth2UserInfo.getEmail();
        String nickname = oAuth2UserInfo.getName() != null ? oAuth2UserInfo.getName() : "unknown_nickname";
        RoleType role = RoleType.ROLE_USER;

        User user = oAuth2Repository.findByUsername(username);
        if (user == null) {
            user = new User(username, password, email, role, provider, providerId);
            user.setNickname(nickname); // Set nickname
            if (provider.equals("google")) {
                user.setOauth("google");
            }
            oAuth2Repository.save(user);
        }

        // AccessToken 생성
        String accessToken = authService.generateTokens(username);

        String encodedValue = URLEncoder.encode(accessToken, StandardCharsets.UTF_8).replace("+", "%20");
        Cookie cookie = new Cookie(JwtUtil.AUTHORIZATION_HEADER, encodedValue);
        cookie.setPath("/");
        cookie.setMaxAge(1800);

        // 클라이언트로 쿠키 전송
        servletRes.addCookie(cookie);

        return new PrincipalDetails(user, oAuth2User.getAttributes());
    }
}
