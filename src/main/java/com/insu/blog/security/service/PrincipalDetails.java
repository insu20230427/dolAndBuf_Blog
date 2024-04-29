package com.insu.blog.security.service;

import com.insu.blog.entity.Post;
import com.insu.blog.entity.User;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

@Data
public class PrincipalDetails implements UserDetails, OAuth2User {

    private User user;
    public Map<String, Object> attributes;

    public PrincipalDetails(User user) {
        this.user = user;
    }

    public PrincipalDetails(User user, Map<String, Object> attributes) {
        this.user = user;
        this.attributes = attributes;
    }

    // implments by UserDetails
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

    @Override // 계정이 갖고있는 권한 목록을 리턴
    public Collection<? extends GrantedAuthority> getAuthorities() {

        Collection<GrantedAuthority> collectors = new ArrayList<>();
        collectors.add(()-> String.valueOf(user.getRole()));

        return collectors;
    }

    //  implments by OAuth2User
    @Override
    public <A> A getAttribute(String name) {
        return OAuth2User.super.getAttribute(name);
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    // 사용하지 않을 예정
    public String getName() {
        return null;
    }
}

