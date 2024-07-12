package com.insu.blog.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.insu.blog.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    // 추가적인 쿼리 메소드를 여기에 정의할 수 있습니다

    @Query("SELECT c FROM Category c WHERE c.user.id = :userId")
    List<Category> findByUserId(@Param("userId") int userId);

//    Category findByName(@Param("name") String name);
}
