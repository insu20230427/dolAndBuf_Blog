package com.insu.blog.dto.request;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class UpdatePostReqDto {
    private String content;
    private String title;
    private int categoryId;
}
