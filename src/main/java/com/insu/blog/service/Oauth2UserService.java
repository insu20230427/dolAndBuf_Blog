package com.insu.blog.service;

import com.insu.blog.entity.RoleType;
import com.insu.blog.entity.User;
import com.insu.blog.provider.GoogleUserInfo;
import com.insu.blog.provider.OAuth2UserInfoInterface;
import com.insu.blog.repository.OAuth2Repository;
import com.insu.blog.security.service.PrincipalDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class Oauth2UserService extends DefaultOAuth2UserService {

    private final OAuth2Repository oAuth2Repository;

    @Value("${insu.key}")
    private String keyPassword;

    // OAuth2 클라이언트는 자동으로 직접 지정한 리다이렉트 uri로 인가코드를 받아와서 액세스 토큰을 받아옴.
    // 이때, 가져온 액세스 토큰을 loadUser이 자동으로 요청하여 유저 프로필을 가져옴
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);

        log.info("getAttributes : " + oAuth2User.getAttributes());

        OAuth2UserInfoInterface oAuth2UserInfo = null;

        // "google" 이면 oAuth2UserInfo를 GoogleUserInfo로 가져옴
        if (userRequest.getClientRegistration().getRegistrationId().equals("google")) {
            log.info("구글 로그인 요청");
            oAuth2UserInfo = new GoogleUserInfo(oAuth2User.getAttributes());
//        } else if (userRequest.getClientRegistration().getRegistrationId().equals("naver")) {
//            oAuth2UserInfo = new NaverUserInfo((Map<String, Object>) oAuth2User.getAttributes().get("response"));
//            log.info("네이버 로그인 요청");
        } else {
            log.info("로그인 실패");
        }

        String privider = oAuth2UserInfo.getProvider();
        String prividerId = oAuth2UserInfo.getProviderId();

        String username = prividerId + "_" + privider;
        String password = keyPassword + "_" + privider;
        String email = oAuth2UserInfo.getEmail() + "_" + privider;
        RoleType role = RoleType.ROLE_USER;

        User user = oAuth2Repository.findByUsername(username);
        if (user == null) {
            user = new User(username, password, email, role, privider, prividerId);
            if (userRequest.getClientRegistration().getRegistrationId().equals("google"))  {
                user.setOauth("google");
            }
            oAuth2Repository.save(user);
        }

        return new PrincipalDetails(user, oAuth2User.getAttributes());
    }
}
