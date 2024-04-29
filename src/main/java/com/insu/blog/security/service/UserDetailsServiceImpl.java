package com.insu.blog.security.service;

import com.insu.blog.entity.User;
import com.insu.blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;

    /*
     스프링 시큐리티가 로그인 요청을 가로챌 때, username, password 변수 2개를 가로채는데
     password 부분은 알아서 처리해주기 때문에, username이 DB에 존재하는지 직접 확인해줘야 됨
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User principal = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("해당 사용자를 찾을 수 없습니다. " + username));
        return new PrincipalDetails(principal); // 시큐리티의 세션저장소에 유저 정보가 저장이 됨.
    }
}

//