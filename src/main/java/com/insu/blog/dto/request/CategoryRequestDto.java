package com.insu.blog.dto.request;

import com.insu.blog.entity.Category;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class CategoryRequestDto {
    private int id;
    private String name;
    private Category parent;
}
