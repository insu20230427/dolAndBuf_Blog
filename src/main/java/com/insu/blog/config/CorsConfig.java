package com.insu.blog.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig { // cross-origin

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowCredentials(true);
        configuration.addAllowedOrigin("*"); // 모든 ip에 대한 허용
        configuration.addAllowedHeader("*"); // 얘는 모든 헤더 요청에 관한 허용
        configuration.addAllowedMethod("*"); // 얘는 모든 http method방식에 대한 허용
        source.registerCorsConfiguration("/api/**", configuration);

        return new CorsFilter(source);
    }
}
