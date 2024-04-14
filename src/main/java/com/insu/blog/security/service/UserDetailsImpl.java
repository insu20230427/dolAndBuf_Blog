package com.insu.blog.security.service;

import com.insu.blog.entity.User;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;

@Data
public class UserDetailsImpl implements UserDetails {

    private User user; // 인증된 user의 정보만 주는 것

    public UserDetailsImpl(User user) {
        this.user = user;
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override // 계정 만료 x
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override // 계정 잠기지 x
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override // 비밀번호 만료 x
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override // 계정 활성화 o
    public boolean isEnabled() {
        return true;
    }

    @Override // 게정이 갖고있는 권한 목록을 리턴
    public Collection<? extends GrantedAuthority> getAuthorities() {

        Collection<GrantedAuthority> collectors = new ArrayList<>();

        collectors.add((GrantedAuthority) () -> "ROLE_"+ user.getRole());

        return new ArrayList<>();
    }
}


