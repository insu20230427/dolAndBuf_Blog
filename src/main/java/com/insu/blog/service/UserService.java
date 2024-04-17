package com.insu.blog.service;

import com.insu.blog.entity.RoleType;
import com.insu.blog.entity.User;
import com.insu.blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserService {

    private final BCryptPasswordEncoder encoder;
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;

    // 회원 가입
    @Transactional
    public void signup(User user) {

        user.setRole(RoleType.USER);
        user.setPassword(encoder.encode(user.getPassword()));

        userRepository.save(user);
    }

    // 회원 찾기
    @Transactional(readOnly = true)
    public User findUser(String username) {
        return userRepository.findByUsername(username).orElseGet(User::new);
    }

    // 회원 수정
    @Transactional
    public void updateUser(User user) {
        User updateUser = userRepository.findById(user.getId()).orElseThrow(() -> new IllegalArgumentException("회원 찾기 실패")
        );

        if(updateUser.getOauth() == null || updateUser.getOauth().equals("")) {
            updateUser.setPassword(encoder.encode(user.getPassword()));
            updateUser.setEmail(user.getEmail());
        }
    }

    public void authenticationUser(User user) {

        // Authentication값 변경
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        log.info("user principal 잘 받아옴 : " + authentication.getPrincipal());
    }
}
