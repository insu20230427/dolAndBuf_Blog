package com.insu.blog.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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

    // 게시글 삭제해도 해당 유저의 게시글이므로 딱히 상관 x
    @ManyToOne(fetch = FetchType.EAGER) // 유저정보는 바로 보여야됨(아이디 or 이름) = EAGER
    @JoinColumn(name = "userId")
    private User user; // user -> User/id -> User

    // 게시글 삭제 시 댓글들이 어떤 게시글의 댓글들인지 알 수 없으므로 CascoadeType을 REMOVE를 줘서 강제삭제
    @OneToMany(mappedBy = "post", fetch = FetchType.EAGER, cascade = CascadeType.REMOVE) // 댓글 보기 버튼이 아닌 바로 보기 = EAGER
    @JsonIgnoreProperties({"board"}) // Post의 Reply에 한하여, board를 호출 무시(= getter 발동 x)
    @OrderBy("id desc")
    private List<Reply> replyList; // replyList -> Reply/post(id) -> List<Reply>

    @CreationTimestamp
    private LocalDateTime createDate;
}
