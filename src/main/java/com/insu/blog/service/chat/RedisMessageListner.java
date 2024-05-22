package com.insu.blog.service.chat;

import java.nio.charset.StandardCharsets;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.insu.blog.dto.chat.ChatMessageDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class RedisMessageListner extends MessageListenerAdapter {
    private final SimpMessagingTemplate template;

    @SuppressWarnings("null")
    @Override
    public void onMessage(Message message, byte[] pattern) {
        log.info("onMessage 잘 실행 전");
        ChatMessageDto chatMessage = convertMessage(message);
        template.convertAndSend("/topic/rooms/${roomId}" + chatMessage.getRoomId(), chatMessage);
        log.info("onMessage 잘 실행 완료");
    }

    private ChatMessageDto convertMessage(Message message) {
        log.info("convertMessage 잘 실행 됨");
        String messageBody = new String(message.getBody(), StandardCharsets.UTF_8);
        ObjectMapper objectMapper = new ObjectMapper();
        ChatMessageDto chatMessageDto = null;
        try {
            chatMessageDto = objectMapper.readValue(messageBody, ChatMessageDto.class);
        } catch (JsonProcessingException e) {
            log.error("메시지 변환 중 오류 발생", e);
        }
        return chatMessageDto;
    }
}
