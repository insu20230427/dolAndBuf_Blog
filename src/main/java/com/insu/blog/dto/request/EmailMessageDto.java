package com.insu.blog.dto.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EmailMessageDto {
    private String to;
    private String subject;
}
