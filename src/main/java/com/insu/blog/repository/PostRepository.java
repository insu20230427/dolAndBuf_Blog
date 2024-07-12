package com.insu.blog.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.insu.blog.entity.Post;

public interface PostRepository extends JpaRepository<Post, Integer> {

    @Query("SELECT p FROM Post p WHERE p.title LIKE %?1% OR p.content LIKE %?1%")
    Page<Post> findByTitleOrContent(String keyword, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.title LIKE %?1%")
    Page<Post> findByTitle(String keyword, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.content LIKE %?1%")
    Page<Post> findByContent(String keyword, Pageable pageable);

    Page<Post> findByCategoryId(int categoryId, Pageable pageable);

    Page<Post> findAllByUserId(Pageable pageable, int userId);

    @Query("SELECT p FROM Post p JOIN p.user u WHERE u.blogName = ?1")
    Page<Post> findAllByBlogName(@Param("blogName") String blogName, Pageable pageable);
}
