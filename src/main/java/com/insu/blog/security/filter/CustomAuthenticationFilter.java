package com.insu.blog.security.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.insu.blog.dto.request.LoginRequestDto;
import com.insu.blog.dto.response.ApiResponseDto;
import com.insu.blog.dto.response.TokenResponseDto;
import com.insu.blog.security.jwt.JwtUtil;
import com.insu.blog.security.service.PrincipalDetails;
import com.insu.blog.service.AuthService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
@Slf4j
public class CustomAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    private final AuthService authService;

    public CustomAuthenticationFilter(AuthService authService) {
        this.authService = authService;

        setFilterProcessesUrl("/api/auth/login");
    }

    @Override // 로그인 요청 처리 : SecurityContext에 Authentication 설정
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        log.info("------attemptAuthentication start------");

        ObjectMapper om = new ObjectMapper();
        try {
            LoginRequestDto loginReqUser = om.readValue(request.getInputStream(), LoginRequestDto.class);
            return getAuthenticationManager().authenticate(
                    new UsernamePasswordAuthenticationToken(loginReqUser.getUsername(), loginReqUser.getPassword())
            );
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override  // 로그인 성공 처리
    protected void successfulAuthentication(HttpServletRequest req, HttpServletResponse res, FilterChain chain, Authentication authResult) throws IOException {
        log.info("------successfulAuthentication start------");

        // 로그인 성공시 메세지 반환
        ApiResponseDto apiResDto = ApiResponseDto.builder().message("로그인 성공!").build();

        // json으로 역직렬화
        String json = new ObjectMapper().writeValueAsString(apiResDto);

        // username 받아오기
        String username = ((PrincipalDetails) authResult.getPrincipal()).getUsername();

        // AccessToken과 RefreshToken 생성
        String accessToken = authService.generateTokens(username);

        // Response 객체의 헤더에 액세스/리프레시 토큰 및, Header KEY 값 추가 및 HttpServletResponse 셋팅
        res.addHeader(JwtUtil.AUTHORIZATION_HEADER, accessToken);
        res.setContentType("application/json");
        res.setCharacterEncoding("UTF-8");
        res.getWriter().write(json);// getWriter().write() -> 바디로 반환
    }

    @Override // 인증 실패 시 401
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) {
        log.error("인증 실패", failed);
        response.setStatus(401);
    }
}
