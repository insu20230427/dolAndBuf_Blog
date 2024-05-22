package com.insu.blog.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.insu.blog.dto.request.CategoryRequestDto;
import com.insu.blog.entity.Category;
import com.insu.blog.entity.Post;
import com.insu.blog.repository.CategoryRepository;
import com.insu.blog.repository.PostRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final PostRepository postRepository;

    // 카테고리 생성
    @Transactional
    public Category createCategory(Category category) {
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

    // 카테고리 수정
    @Transactional
    public Category updateCategory(int id, CategoryRequestDto categoryDetails) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 카테고리가 존재하지 않습니다. ID: " + id));

        category.setName(categoryDetails.getName());
        category.setParent(categoryDetails.getParent());
        return categoryRepository.save(category);
    }

    // 카테고리 삭제
    @Transactional
    public void deleteCategory(int id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 카테고리가 존재하지 않습니다. ID: " + id));
        categoryRepository.delete(category);
    }
}
