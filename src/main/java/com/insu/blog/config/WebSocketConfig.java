package com.insu.blog.config;

import com.insu.blog.service.chat.StompHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@SuppressWarnings("null")
@Configuration
@EnableWebSocketMessageBroker // 메세지 브로커(스톰프 메세지 환경 설정 o)
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    // STOMP는 메시지의 형식, 명령어(예: CONNECT, SUBSCRIBE, UNSUBSCRIBE, SEND 등), 헤더, 바디 등을 정의
    // Websocket은 양방형 통신 채널을 제공

    private final StompHandler stompHandler;
    // private final MessageChannel clientOutboundChannel;

    // 메세지 구독 및 발행 시 경로
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic"); // 구독 
        registry.setApplicationDestinationPrefixes("/app"); // 메세지 보낼때
    }

    // Stomp 엔드포인트 등록
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
        .setAllowedOriginPatterns("*")
        .withSockJS();
    }

    // 클라이언트로부터 서버로 들어오는 메시지를 처리하기 전에 intercept
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(stompHandler);
    }

    // @Primary
    // @Bean
    // public SimpMessagingTemplate simpMessagingTemplate() {
    //     return new SimpMessagingTemplate(clientOutboundChannel);
    // }
}