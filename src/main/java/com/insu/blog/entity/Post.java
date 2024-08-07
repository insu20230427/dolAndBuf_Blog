package com.insu.blog.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@DynamicInsert
@RequiredArgsConstructor
@Getter
@Setter
@Entity
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, unique = true, length = 100)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private int count;

    @ColumnDefault("0")
    private Long likeCnt;

    // 게시글 삭제해도 해당 유저의 게시글이므로 딱히 상관 x
    @ManyToOne(fetch = FetchType.EAGER) // 유저정보는 바로 보여야됨(아이디 or 이름) = EAGER
    @JoinColumn(name = "user_id")
    private User user; // user -> User/id -> User

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    // 게시글 삭제 시 댓글들이 어떤 게시글의 댓글들인지 알 수 없으므로 CascoadeType을 REMOVE를 줘서 강제삭제
    // Entity의 양방향관계 시,OneToMany에선 FK를 가진 Field(Many쪽)가 연관관계의 주인이 되어서,
    // Reply의 Post를 업데이트 시, Post로 Reply를 읽어올 수 있음.
    @OneToMany(mappedBy = "post", fetch = FetchType.EAGER, cascade = CascadeType.REMOVE) // 댓글 보기 버튼이 아닌 바로 보기 = EAGER
    @OrderBy("id desc")
    private List<Reply> replyList;

    @OneToMany(mappedBy = "post", cascade = CascadeType.REMOVE)
    private List<PostLike> postLikeList = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createDate;

    @UpdateTimestamp
    private LocalDateTime modifyDate;
}
