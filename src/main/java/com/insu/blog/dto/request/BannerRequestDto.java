package com.insu.blog.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BannerRequestDto {
    private String url;
    private String bannerDescription;
}