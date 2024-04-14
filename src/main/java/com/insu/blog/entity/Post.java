package com.insu.blog.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;

import java.time.LocalDateTime;
import java.util.List;

@DynamicInsert
@RequiredArgsConstructor
@Data
@Entity
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, unique = true, length = 100)
    private String title;

    @Lob
    private String content;

    private int count;

    @ManyToOne(fetch = FetchType.EAGER) // 유저정보는 바로 보여야됨(아이디 or 이름) = EAGER
    @JoinColumn(name="userId")
    private User user; // user -> User/id -> User

    @OneToMany(mappedBy = "post", fetch = FetchType.EAGER) // 댓글 보기 버튼이 아닌 바로 보기 = EAGER
    private List<Reply> replyList; // replyList -> Reply/post(id) -> List<Reply>

    @CreationTimestamp
    private LocalDateTime createDate;
}
