package com.insu.blog.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean // 인증 매니저에게 세션에 저장된 UserDetailsService와 PasswordEncoder를 자동 설정
    AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean // Spring Security 설정
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        // CSRF 비활성화
        http.csrf(AbstractHttpConfigurer::disable);

        http.authorizeHttpRequests(authorizeHttpRequests ->
                        authorizeHttpRequests
                                .requestMatchers("/", "/js/**", "/css/**", "/image/**").permitAll()
                                .requestMatchers("/auth/**").permitAll()
                                .requestMatchers("/api/**").permitAll()
                                .requestMatchers("/WEB-INF/**").permitAll()
                                .requestMatchers("/view/auth/**").permitAll()
                                .anyRequest().authenticated() // 그 외 요청은 인증 필요
                );

//      로그인폼을 리다이렉트 페이지 설정
        http.formLogin(formLogin ->
                formLogin
                        .loginPage("/view/auth/loginForm")
                        .loginProcessingUrl("/api/auth/login") // 해당 경로로 로그인 요청 시, 스프링 시큐리티가 가로채서 로그인을 하게 됨
                        .defaultSuccessUrl("/")
                        .failureUrl("/")
        );

        return http.build();
    }
}
