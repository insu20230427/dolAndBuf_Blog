package com.insu.blog.security.jwt;

import com.insu.blog.entity.User;
import com.insu.blog.repository.UserRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.concurrent.TimeUnit;

@Slf4j
@RequiredArgsConstructor
@Component
public class JwtUtil {

    private final RedisTemplate<String, String> redisTemplate;
    private final UserRepository userRepository;

    // Header KEY 값
    public static final String AUTHORIZATION_HEADER = "Authorization";

    // Token 식별자
    public static final String BEARER_PREFIX = "Bearer ";

    @Value("${jwt.token.access-expiration-time}")
    private long accessExpirationTime;

    @Value("${jwt.token.refresh-expiration-time}")
    private long refreshExpirationTime;

    // 어플리케이션에서 유일한 SecretKey를 사용하고, 해당 SecretKey는 Base64형식으로 인코딩되어 있음.
    @Value("${jwt.secret.key}")
    private String secretKey;

    // secretKey를 디코딩하여 HMAC-SHA 키로 변환
    private Key key;

    @PostConstruct
    public void init() {
        byte[] bytes = Base64.getDecoder().decode(secretKey);
        key = Keys.hmacShaKeyFor(bytes);
    }

    // 액세스 토큰 생성
    public String createAccessToken(String username) {
        Date now = new Date();
        Date expireDate = new Date(now.getTime() + accessExpirationTime);

        User user = userRepository.findByUsername(username).orElseThrow(() -> new IllegalArgumentException("회원 찾기 실패"));

        return BEARER_PREFIX +
                Jwts.builder()
                        .setSubject(username) // Subject Claim
                        .claim("userId", user.getId())
                        .claim("email", user.getEmail())
                        .claim("oauth", user.getOauth())
                        .claim("nickname", user.getNickname())
                        .setIssuedAt(now) // 발급일
                        .setExpiration(expireDate) // 만료일
                        .signWith(key, SignatureAlgorithm.HS256)
                        .compact();
    }

    // 리프레시 토큰 생성
    public String createRefreshToken(String username) {
        Date now = new Date();
        Date expireDate = new Date(now.getTime() + refreshExpirationTime);

        String refreshToken = BEARER_PREFIX +
                Jwts.builder()
                        .setIssuedAt(now)
                        .setExpiration(expireDate)
                        .signWith(key, SignatureAlgorithm.HS256)
                        .compact();

        // redis에 저장
        redisTemplate.opsForValue().set(
                "refresh_" + username,
                refreshToken,
                refreshExpirationTime,
                TimeUnit.MILLISECONDS
        );
        return refreshToken;
    }

    // JWT 토큰 substring
    public String substringToken(String tokenValue) {
        if (StringUtils.hasText(tokenValue) && tokenValue.startsWith(BEARER_PREFIX)) {
            return tokenValue.substring(7);
        }
        return null;
    }

    // 유효성 검증
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            log.error("유효하지 않는 JWT 서명 입니다.");
        } catch (ExpiredJwtException e) {
            log.error("만료된 JWT 토큰 입니다.");
        } catch (UnsupportedJwtException e) {
            log.error("지원되지 않는 JWT 토큰 입니다.");
        } catch (IllegalArgumentException e) {
            log.error("잘못된 JWT 토큰 입니다.");
        }
        return false;
    }

    // Jwt토큰에서 Claim(사용자 정보)를 추출
    public Claims getUserInfoFromToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
    }
}
