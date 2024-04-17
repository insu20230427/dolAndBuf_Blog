package com.insu.blog.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReplyRequestDto {
    private int userId;
    private int postId;
    private String content;
}
