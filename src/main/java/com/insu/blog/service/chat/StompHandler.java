package com.insu.blog.service.chat;

import com.insu.blog.repository.chat.ChatRoomRedisRepository;
import com.insu.blog.security.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

@SuppressWarnings("null")
@Slf4j(topic = "StompHandler")
@RequiredArgsConstructor
@Component
public class StompHandler implements ChannelInterceptor {

    private final JwtUtil jwtUtil;
    private final ChatRoomRedisRepository chatRoomRedisRepository;

    /**
     * WebSocket 요청을 처리하기 전에 JWT 토큰의 유효성을 검증.
     * @param message 들어오는 메시지
     * @param channel 메시지가 연결된 채널
     * @return 원본 또는 수정된 메시지
     */
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        log.info("메시지 처리 전 preSend 이벤트 처리: {}", message);

        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authToken = accessor.getFirstNativeHeader("Authorization");
            log.info("authToken: {}", authToken);
            String tokenValue = jwtUtil.substringToken(authToken);
            validateToken(tokenValue);
        }

        return message;
    }

    /**
     * JWT 토큰을 검증.
     */
    private void validateToken(String tokenValue) {
        if (!jwtUtil.validateToken(tokenValue)) {
            throw new IllegalArgumentException("유효하지 않은 JWT 토큰");
        }
    }

    /**
     * 사용자의 구독을 관리.
     */
    @Override
    public void postSend(Message<?> message, MessageChannel channel, boolean sent) {
        if (sent) {
            log.info("메시지 처리 후 postSend 이벤트 처리 성공: {}", message);
        } else {
            log.error("메시지 처리 후 postSend 이벤트 처리 실패: {}", message);
        }

        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
            manageSubscription(accessor);
        }
    }

    /**
     * 구독 관리 및, 세션 ID와 채팅방 ID를 연결.
     * @param accessor 메시지 헤더에 접근하기 위한 접근자
     */
    private void manageSubscription(StompHeaderAccessor accessor) {
        String sessionId = accessor.getSessionId();
        String roomId = accessor.getDestination().substring("/topic/rooms/".length());
        chatRoomRedisRepository.setUserEnterInfo(sessionId, roomId);
    }

    /**
     * 클라이언트의 연결 종료를 처리하며, 세션과 방 ID 매핑을 제거.
     */
    @Override
    public void afterSendCompletion(Message<?> message, MessageChannel channel, boolean sent, Exception ex) {
        if (sent) {
            log.info("메시지 전송 완료 후 afterSendCompletion 이벤트 처리 성공: {}", message);
        } else {
            log.error("메시지 전송 완료 후 afterSendCompletion 이벤트 처리 실패: {}", message);
            if (ex != null) {
                log.error("전송 실패 원인: {}", ex);
            }
        }
    
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        if (StompCommand.DISCONNECT.equals(accessor.getCommand())) {
            String sessionId = accessor.getSessionId();
            chatRoomRedisRepository.removeUserEnterInfo(sessionId);
            log.info("세션 종료 처리: {}", sessionId);
        }
    }
}

