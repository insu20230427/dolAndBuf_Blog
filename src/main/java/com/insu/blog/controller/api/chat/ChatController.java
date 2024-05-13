package com.insu.blog.controller.api.chat;

import com.insu.blog.dto.chat.ChatMessageDto;
import com.insu.blog.security.service.PrincipalDetails;
import com.insu.blog.service.chat.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.io.IOException;

/*
    publisher 구현 (WebSocketChatHandler -> ChatController)
 */
@RequiredArgsConstructor
@Controller
@Slf4j(topic = "ChatController")
public class ChatController {

    private final ChatService chatService;
//    private final S3Uploader s3Uploader;

    /*
        Websocket "/pub/chat/message"로 들어오는 메세지 처리
     */
    @MessageMapping("/chat/message")
    public void message(ChatMessageDto message, @Header("Authorization") String token) {
        log.info("ChatController - message 전송");

        // Websocket 에 발행된 메세지 redis 로 발행 (publish)
        chatService.sendChatMessage(message, token);
    }

    @PostMapping("/chat/file/{roomId}")
    public void messageFile(
            @PathVariable Long roomId,
//            @RequestPart(value = "chatImage", required = false) MultipartFile chatImage,
            @AuthenticationPrincipal PrincipalDetails principalDetails
            ) {
//        // s3 에 업로드
//        String imageUrl = s3Uploader.upload(chatImage, "chat-images");

//        chatService.sendImageMessage(roomId, imageUrl, userDetails.getUser());
        chatService.sendImageMessage(roomId, principalDetails.getUser());
    }
}
