package com.insu.blog.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

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

    @Column(unique = true)
    private String nickname;

    @Column
    private String profileImage;

    @Column(unique = true, length = 100)
    private String email;

    @Enumerated(EnumType.STRING)
    private RoleType role;

    private String oauth;

    private String provider;

    private String providerId;

    @CreationTimestamp
    private LocalDateTime createDate;

    public User(String kakaoUsername, String garbagePassword, String oauth) {
        this.username = kakaoUsername;
        this.password = garbagePassword;
        this.oauth = oauth;
    }

    public User(String naverUsername, String garbagePassword, String email, String oauth) {
        this.username = naverUsername;
        this.password = garbagePassword;
        this.email = email;
        this.oauth = oauth;
    }

    public User(String username, String password, String email, RoleType role) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
    }

    @Builder
    public User(String username, String password, String email, RoleType role, String provider, String providerId) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
        this.provider = provider;
        this.providerId = providerId;
    }
}