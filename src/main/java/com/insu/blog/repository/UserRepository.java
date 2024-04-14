package com.insu.blog.repository;

import com.insu.blog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    /**
     * SELECT * FROM user WHERE username = ?;
     */
    Optional<User> findByUsername(String username);
}
