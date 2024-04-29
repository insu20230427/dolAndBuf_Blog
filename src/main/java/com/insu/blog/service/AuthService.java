package com.insu.blog.service;

import com.insu.blog.security.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final JwtUtil jwtUtil;
    private final RedisTemplate<String, String> redisTemplate;

    @Value("${jwt.token.refresh-expiration-time}")
    private long refreshExpirationTime;

    public String generateTokens(String username) {
        // 토큰 생성
        String accessToken = jwtUtil.createAccessToken(username);
        String refreshToken = jwtUtil.createRefreshToken(username);

        // Redis에 Refresh 저장
        redisTemplate.opsForValue().set("refresh_" + username, refreshToken, refreshExpirationTime, TimeUnit.MILLISECONDS);

        return accessToken;
    }

    // 검증 후 accessToken이 존재하지 않고, RefreshToken이 없으면 토큰들 재발급
    public String refreshToken(String username) {
        // 기존 리프레쉬 토큰 삭제(한 번 사용하면 삭제하기)
        redisTemplate.delete("refresh_" + username);

        // 새로운 AccessToken 및 RefreshToken 생성 및 Redis 갱신
        String newAccessToken = jwtUtil.createAccessToken(username);
        String newRefreshToken = jwtUtil.createRefreshToken(username);

        redisTemplate.opsForValue().set("refresh_" + username, newRefreshToken, refreshExpirationTime, TimeUnit.MILLISECONDS);

        return newAccessToken;
    }
}

// test

