package com.insu.blog.dto.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CommentReplyRequestDto {
    private int userId;
    private String content;
}
