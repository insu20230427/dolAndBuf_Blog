package com.insu.blog.dto.request;

import lombok.Data;

@Data
public class ReplyRequestDto {
    private int userId;
    private int postId;
    private String content;
}
