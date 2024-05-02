package com.insu.blog.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class CommentReplyLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "commentReply_id")
    private CommentReply commentReply;

    @Column
    private boolean likes;

    public CommentReplyLike(User user, CommentReply commentReply, boolean likes) {
        this.user = user;
        this.commentReply = commentReply;
        this.likes = likes;
    }
}
