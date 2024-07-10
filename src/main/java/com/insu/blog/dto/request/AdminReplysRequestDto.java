package com.insu.blog.dto.request;

import com.insu.blog.entity.Post;
import com.insu.blog.entity.User;

import lombok.Data;

@Data
public class AdminReplysRequestDto {
    private int id;
    private User user;
    private Post post;
    private String content;
    private String createDate;
    private boolean visible;
}
