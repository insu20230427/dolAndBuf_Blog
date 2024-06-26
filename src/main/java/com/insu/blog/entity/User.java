package com.insu.blog.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, unique = true, length = 100)
    private String username;

    @Column(nullable = false, length = 200)
    private String password;

    @Column(nullable = false, unique = true, length = 8)
    private String nickname;

    @Column
    private String AvatarImage;

    @Column(unique = true, length = 100)
    private String email;

    @Enumerated(EnumType.STRING)
    private RoleType role;

    private String oauth;

    private String provider;

    private String providerId;

    @Column(length = 200)
    private String bannerImageUrl;

    private String bannerDescription;
  
    @Column(unique = true, length = 100)
    private String blogName; // User 블로그이름 추가

    @CreationTimestamp
    private LocalDateTime createDate;

    public User(String kakaoUsername, String garbagePassword, String oauth) {
        this.username = kakaoUsername;
        this.password = garbagePassword;
        this.oauth = oauth;
        this.blogName = username;
    }

    public User(String naverUsername, String garbagePassword, String email, String oauth) {
        this.username = naverUsername;
        this.password = garbagePassword;
        this.email = email;
        this.oauth = oauth;
        this.blogName = username;
    }

    @Builder
    public User(String username, String password, String email, RoleType role, String nickname) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
        this.blogName = username;
        this.nickname = nickname;
    }

    @Builder
    public User(String username, String password, String email, RoleType role, String provider, String providerId) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
        this.provider = provider;
        this.providerId = providerId;
        this.blogName = (blogName == null) ? username : blogName; // blogName이 null이면 username을 기본값으로 설정
    }
}