package com.insu.blog.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;

import java.time.LocalDateTime;

@DynamicInsert
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, unique = true, length = 100)
    private String username;

    @Column(nullable = false, length = 100)
    private String password;

    @Column(unique = true, length = 100)
    private String email;

    @Enumerated(EnumType.STRING)
    private RoleType role;

    private String oauth;

    @CreationTimestamp
    private LocalDateTime createDate;

    public User(String kakaoUsername, String garbagePassword, String oauth) {
        this.username = kakaoUsername;
        this.password = garbagePassword;
        this.oauth = oauth;
    }
}
