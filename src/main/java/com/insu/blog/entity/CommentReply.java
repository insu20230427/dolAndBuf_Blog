package com.insu.blog.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@Getter
@Setter
@Entity
public class CommentReply {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, length = 200)
    private String content;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "reply_id")
    private Reply reply;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ColumnDefault("0")
    private Long likeCnt;

    @OneToMany(mappedBy = "commentReply", fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
    private List<CommentReplyLike> replyLikeList = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createDate;
}
