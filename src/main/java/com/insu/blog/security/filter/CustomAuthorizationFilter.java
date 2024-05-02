package com.insu.blog.security.filter;

import com.insu.blog.entity.User;
import com.insu.blog.repository.UserRepository;
import com.insu.blog.security.jwt.JwtUtil;
import com.insu.blog.security.service.UserDetailsServiceImpl;
import com.insu.blog.service.AuthService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
public class CustomAuthorizationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final AuthService authService;
    private final UserDetailsServiceImpl userDetailsService;
    private final RedisTemplate<String, String> redisTemplate;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest req, @NonNull HttpServletResponse res, @NonNull FilterChain filterChain) throws ServletException, IOException {

        // 헤더에서 JWT 토큰 가져오기
        String accessTokenValue = req.getHeader(JwtUtil.AUTHORIZATION_HEADER);
        String username = null;
        if (StringUtils.hasText(accessTokenValue)) {
            // JWT 토큰 substring
            accessTokenValue = jwtUtil.substringToken(accessTokenValue);

            // 유효성 검증
            if (!jwtUtil.validateToken(accessTokenValue)) {
                log.info("토큰이 유효하지 않거나 존재하지 않습니다.");
                return;
            }

            // Claims 값(username) 추출
            username = jwtUtil.getUserInfoFromToken(accessTokenValue).getSubject();

            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isPresent()) {
            String refreshTokenValue = redisTemplate.opsForValue().get("refresh_" + optionalUser.get().getUsername());

            // AccessToken이 만료되었어도, refreshToken이 유효할 때 새로운 Tokens를 생성하여 반환
            if (accessTokenValue == null && refreshTokenValue != null) {

                // RefreshToken으로 새로운 AccessToken 발급
                String newAccessToken = authService.refreshToken(optionalUser.get().getUsername());

                String encodedValue = URLEncoder.encode(newAccessToken, StandardCharsets.UTF_8).replace("+", "%20");
                Cookie cookie = new Cookie(JwtUtil.AUTHORIZATION_HEADER, encodedValue);
                cookie.setPath("/");
                cookie.setMaxAge(1800);

                res.addCookie(cookie);
            }
        }
        filterChain.doFilter(req, res);
    }
}


