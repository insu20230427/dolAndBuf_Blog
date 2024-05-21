package com.insu.blog.service.chat;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.insu.blog.dto.chat.ChatMessageDto;
import com.insu.blog.entity.User;
import com.insu.blog.entity.chat.ChatMessage;
import com.insu.blog.repository.UserRepository;
import com.insu.blog.repository.chat.ChatMessageRepository;
import com.insu.blog.security.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RequiredArgsConstructor
@Service
@Slf4j(topic = "ChatService")
public class ChatService {

    private final JwtUtil jwtUtil;
    private final ChannelTopic channelTopic;
    // private final RedisTemplate<String, String> redisTemplate;
	private final SimpMessagingTemplate template;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final ChatMessageRepository chatMessageRepository;

    // 채팅방에 메시지 발송
    public void publishMessageToRedis(ChatMessageDto chatMessageDto, String token) {
        log.info("sendMessage 메서드 시작");

        // 메세지 header 의 토큰으로 sender 설정
        String pureToken = jwtUtil.substringToken(token);
        String username = jwtUtil.getUserInfoFromToken(pureToken).getSubject();
        User user = findUserByUsername(username);
//        chatMessageDto.setSender(user.getNickname());
        chatMessageDto.setSender(username);

        // 나가기 메세지일 경우
        if (ChatMessageDto.MessageType.QUIT.equals(chatMessageDto.getType())) {
            chatMessageDto.setMessage(chatMessageDto.getSender() + "님이 방에서 나갔습니다.");
            chatMessageDto.setSender("[알림]");
        }

        // 메세지 저장
        chatMessageRepository.save(new ChatMessage(user, chatMessageDto));

        // 메세지 dto에 현재 시각 설정 (사용자에게 바로 보내질 시각)
        chatMessageDto.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yy-MM-dd HH:mm")));
        log.info("메세지 발송 시각? {}", chatMessageDto.getCreatedAt());

        // 메시지를 JSON 문자열로 변환하여 Redis로 발송
        try {
            String messageJson = objectMapper.writeValueAsString(chatMessageDto);
            log.info("try 실행 전 ");
            // redisTemplate.convertAndSend(channelTopic.getTopic(), messageJson);
            template.convertAndSend("/topic/rooms/" + chatMessageDto.getRoomId(), messageJson);
            log.info("try 실행 후 완료");
        } catch (Exception e) {
            log.error("Failed to publish message to Redis", e);
        }
    }

    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() ->
                new NullPointerException("존재하지 않는 사용자"));
    }

    
    // public String getRoomId(String destination) {
    //     log.info("getRoomId 원래 destination -> " + destination);
    //     int lastIndex = destination.lastIndexOf('/');
    //     if (lastIndex != -1)
    //         return destination.substring(lastIndex + 1);
    //     else
    //         return "";
    // }

        // // 채팅방에 파일 발송
    // public void sendImageMessage(Long roomId, User user) {
    //     log.info("sendImageMessage 메서드 시작");

    //     ChatMessageDto chatMessageDto = ChatMessageDto.builder().roomId(roomId).build();
    //     chatMessageDto.setSender(user.getNickname());

    //     // 메세지 저장
    //     chatMessageRepository.save(new ChatMessage(user, chatMessageDto));

    //     // 메세지 dto에 현재 시각 설정 (사용자에게 바로 보내질 시각)
    //     chatMessageDto.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yy-MM-dd HH:mm")));
    //     log.info("메세지 발송 시각? " + chatMessageDto.getCreatedAt());

    //     // 발송
    //     redisTemplate.convertAndSend(channelTopic.getTopic(), chatMessageDto);
    // }

}

