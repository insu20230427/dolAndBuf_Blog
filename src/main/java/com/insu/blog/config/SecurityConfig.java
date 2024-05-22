package com.insu.blog.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.CorsFilter;

import com.insu.blog.repository.UserRepository;
import com.insu.blog.security.filter.CustomAuthenticationFilter;
import com.insu.blog.security.filter.CustomAuthorizationFilter;
import com.insu.blog.security.jwt.JwtUtil;
import com.insu.blog.security.service.UserDetailsServiceImpl;
import com.insu.blog.service.AuthService;
import com.insu.blog.service.Oauth2UserService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity // 필터를 필터 체인(Config)에 등록
@EnableMethodSecurity

public class SecurityConfig {
    private final Oauth2UserService oauth2UserService;
    private final JwtUtil jwtUtil;
    private final AuthenticationConfiguration authenticationConfiguration;
    private final AuthService authService;
    private final UserDetailsServiceImpl userDetailsService;
    private final CorsFilter corsFilter;
    private final RedisTemplate<String, String> redisTemplate;
    private final UserRepository userRepository;

    // BCryptPasswordEncoder 의존성 주입
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // AuthenticationManager 의존성 주입
    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean // Spring Security 설정
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        // CustomAuthorizationFilter -> CustomAuthenticationFilter ->
        // UsernamePasswordAuthenticationFilter 순으로 필터 작동
        http.addFilterBefore(customAuthorizationFilter(), CustomAuthenticationFilter.class);
        http.addFilterBefore(customAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        http.addFilter(corsFilter);

        // 비활성화
        http.sessionManagement(
                sessionManagement -> sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        http.csrf(AbstractHttpConfigurer::disable); // 토큰 사용할거라 csrf disable
        http.formLogin(AbstractHttpConfigurer::disable); // security에서 지원하는 formLogin disable
        http.httpBasic(AbstractHttpConfigurer::disable); // JWT를 통해 암호화해서 보낼거라 disable

        // 요청에 대한 인가 권한을 부여해주는 것.
        http.authorizeHttpRequests(authorizeHttpRequests -> authorizeHttpRequests
                .requestMatchers("/manager/**").hasAnyRole("Role_ADMIN", "Role_MANAGER") // 해당 Role이 존재하면 인가허용
                .requestMatchers("/admin/**").hasRole("Role_ADMIN")
                .requestMatchers("/view/posts/**, /view/users/**").authenticated() // 해당 요청은 인증이 무조건 필요o
                .requestMatchers("/api/users/**, /api/posts/**, /api/replys/**").authenticated()
                .anyRequest().permitAll()// 그 외 요청은 인증 허용 해줌.
        );

        // 리다이렉트 페이지 설정
        http.oauth2Login(oauth2Login -> oauth2Login
                .loginPage("/view/auth/loginForm")
                .userInfoEndpoint(userInfoEndpoint -> userInfoEndpoint
                        .userService(oauth2UserService) // userInfo를 가져올 서비스를 지정(해당 서비스의 loadUser()를 통해 가져옴)
                ));

        // http.formLogin(formLogin -> formLogin
        // .loginPage("/view/auth/loginForm") // 인증이 필요한 URL에 접근하면 이 경로로 리다이렉트
        // .loginProcessingUrl("/api/auth/login") // 해당 경로로 로그인 요청 시, 스프링 시큐리티가 가로채서
        // 로그인을 하게 됨
        // .defaultSuccessUrl("/")
        // );

        // http.logout(logout -> logout
        // .logoutUrl("/logout")
        // .logoutSuccessHandler((request, response, authentication) -> {
        // response.sendRedirect("/view/auth/loginForm");
        // })
        // .deleteCookies("remember-me")
        // );

        return http.build();
    }

    public CustomAuthenticationFilter customAuthenticationFilter() throws Exception {
        CustomAuthenticationFilter filter = new CustomAuthenticationFilter(authService);
        filter.setAuthenticationManager(authenticationManager(authenticationConfiguration));
        return filter;
    }

    // JWT 권한 검사 필터 Bean 설정
    public CustomAuthorizationFilter customAuthorizationFilter() {
        return new CustomAuthorizationFilter(jwtUtil, authService, userDetailsService, redisTemplate, userRepository);
    }
}
