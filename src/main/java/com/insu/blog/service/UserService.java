package com.insu.blog.service;

import com.insu.blog.entity.RoleType;
import com.insu.blog.entity.User;
import com.insu.blog.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class UserService {

    @Autowired
    private BCryptPasswordEncoder encoder;

    @Autowired
    private  UserRepository userRepository;


    // 회원가입
    @Transactional
    public void signup(User user) {


        user.setRole(RoleType.USER);
        user.setPassword(encoder.encode(user.getPassword()));

        userRepository.save(user);
    }

}
