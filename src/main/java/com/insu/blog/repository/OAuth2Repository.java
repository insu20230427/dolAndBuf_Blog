package com.insu.blog.repository;

import com.insu.blog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OAuth2Repository extends JpaRepository<User, Integer> {
     User findByUsername(String username);
}
