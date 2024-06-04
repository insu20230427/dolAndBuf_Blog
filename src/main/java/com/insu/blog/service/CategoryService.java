package com.insu.blog.service;

import com.insu.blog.dto.request.CategoryRequestDto;
import com.insu.blog.entity.Category;
import com.insu.blog.entity.Post;
import com.insu.blog.entity.User;
import com.insu.blog.repository.CategoryRepository;
import com.insu.blog.repository.PostRepository;
import com.insu.blog.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class CategoryService {

    private static final Logger log = LoggerFactory.getLogger(CategoryService.class);
    private final CategoryRepository categoryRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    // 카테고리 생성
    @Transactional
    public Category createCategory(CategoryRequestDto categoryDetails) {
        Category category = new Category();
        category.setName(categoryDetails.getName());

        if (categoryDetails.getParentId() != null) {
            Category parent = categoryRepository.findById(categoryDetails.getParentId())
                    .orElseThrow(() -> new RuntimeException("상위 카테고리가 존재하지 않습니다."));
            category.setParent(parent);
        }

        User user = userRepository.findById(categoryDetails.getUserId())
                .orElseThrow(() -> new RuntimeException("유저가 존재하지 않습니다."));
        category.setUser(user);

        return categoryRepository.save(category);
    }

    // // 유저 카테고리 조회
    // @Transactional
    // public List<Category> getAllCategories(int userId) {
    // return categoryRepository.findAllByUserId(userId);
    // }

    // 카테고리 전체조회
    @Transactional(readOnly = true)
    public List<Category> getCategoriesByUserId(int userId) {
        return categoryRepository.findByUserId(userId);
    }

    // 카테고리 상세 조회
    @Transactional
    public Page<Post> getPostsByCategoryId(int categoryId, Pageable pageable) {
        return postRepository.findByCategoryId(categoryId, pageable);
    }

    // 카테고리 아이디로 조회
    public Optional<Category> getCategoryById(int categoryId) {
        return categoryRepository.findById(categoryId);
    }

    // 카테고리 수정
    @Transactional
    public Category updateCategory(int id, CategoryRequestDto categoryDetails) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 카테고리가 존재하지 않습니다. ID: " + id));

        if (categoryDetails.getName() != null) {
            category.setName(categoryDetails.getName());
        }

        if (categoryDetails.getParentId() != null) {
            Category parentCategory = categoryRepository.findById(categoryDetails.getParentId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "상위 카테고리가 존재하지 않습니다. ID: " + categoryDetails.getParentId()));
            category.setParent(parentCategory);
        }

        // 하위 카테고리 수정(미정)
        if (categoryDetails.getChildrenId() != null && !categoryDetails.getChildrenId().isEmpty()) {
            List<Category> children = categoryDetails.getChildrenId().stream()
                    .map(childId -> categoryRepository.findById(childId)
                            .orElseThrow(() -> new IllegalArgumentException("해당 카테고리가 존재하지 않습니다. ID: " + childId)))
                    .collect(Collectors.toList());
            category.setChildren(children);
        }

        log.info("CategoryService / category : {}", category);
        return categoryRepository.save(category);
    }

    // 카테고리 삭제
    @Transactional
    public void deleteCategory(int id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 카테고리가 존재하지 않습니다. ID: " + id));
        categoryRepository.delete(category);
    }

    // 카테고리 이름으로 조회
    public Category findByName(String name) {
        return categoryRepository.findByName(name);
    }
}
