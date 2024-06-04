package com.insu.blog.dto.request;

import com.insu.blog.entity.Category;
import java.util.List;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
public class CategoryRequestDto {
    private int id;
    private String name;
    private Integer parentId;
    private Integer postCount;
    private List<Integer> childrenId;
    private Integer userId;

    // 생성자, getter, setter
    public CategoryRequestDto(int id, String name, Integer parentId, Integer userId, Integer postCount,
            List<Integer> childrenId) {
        this.id = id;
        this.name = name;
        this.parentId = parentId;
        this.userId = userId;
        this.postCount = postCount;
        this.childrenId = childrenId;
    }

    public static CategoryRequestDto fromEntity(Category category) {

        return new CategoryRequestDto(
                category.getId(),
                category.getName(),
                category.getParent() != null ? category.getParent().getId() : null,
                category.getUser().getId(),
                category.getPosts().size(),
                category.getChildren().stream().map(Category::getId).collect(Collectors.toList()));
    }

    // public static Category toEntity(CategoryRequestDto categoryRequestDto){
    // return new Category(

    // );
    // }
}
