package com.insu.blog.controller.api.chat;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.insu.blog.dto.chat.ChatMessageDto;
import com.insu.blog.dto.chatRoom.ChatRoomInfoResponseDto;
import com.insu.blog.dto.chatRoom.ChatRoomNameRequestDto;
import com.insu.blog.dto.chatRoom.CreateChatRoomRequestDto;
import com.insu.blog.dto.chatRoom.MemberInfoListDto;
import com.insu.blog.dto.chatRoom.MyChatRoomResponseDto;
import com.insu.blog.dto.response.ApiResponseDto;
import com.insu.blog.security.service.PrincipalDetails;
import com.insu.blog.service.chat.ChatRoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chatRooms")
@Slf4j(topic = "ChatRoomController")
public class ChatRoomController {

    private final ChatRoomService chatRoomService;

    // // 채팅방 생성
    // @PostMapping
    // public ResponseEntity<ApiResponseDto> createChatRoom(
    // @AuthenticationPrincipal PrincipalDetails userDetails,
    // @RequestBody CreateChatRoomRequestDto req) {

    // String nickname = req.getNickname();
    // log.info("채팅방 생성 컨트롤러 -> nickname: {}", nickname);

    // ChatRoomInfoResponseDto result =
    // chatRoomService.createChatRoom(userDetails.getUser(), req);

    // return ResponseEntity.ok().body(ApiResponseDto.builder().message("채팅방 생성
    // 완료").data(result).build());
    // }

    // 채팅방 생성 또는 가져오기
    @PostMapping("/between")
    public ResponseEntity<ApiResponseDto> getOrCreateChatRoom(
            @AuthenticationPrincipal PrincipalDetails userDetails,
            @RequestBody CreateChatRoomRequestDto req) {

        ChatRoomInfoResponseDto chatRoom = chatRoomService.createOrGetChatRoom(userDetails.getUser(), req);
        return ResponseEntity.ok(ApiResponseDto.builder().message("채팅방 생성 완료").data(chatRoom).build());
    }

    // 채팅방 채팅 기록 조회
    @GetMapping("/{roomId}")
    public ResponseEntity<ApiResponseDto> getChatRoomChatMessages(
            @PathVariable("roomId") String roomId,
            @AuthenticationPrincipal PrincipalDetails userDetails) {
        log.info("채팅방 채팅 기록 조회 컨트롤러 -> {}", roomId);
        List<ChatMessageDto> chatMessageDtoList = chatRoomService.getChatRoomChatMessages(roomId,
                userDetails.getUser());

        return ResponseEntity.ok()
                .body(ApiResponseDto.builder().message("채팅방 채팅 기록 조회 완료").data(chatMessageDtoList).build());
    }

    // 채팅방 이름 수정
    @PutMapping("/{roomId}")
    public ResponseEntity<ApiResponseDto> updateChatRoomName(
            @PathVariable("roomId") String roomId,
            @AuthenticationPrincipal PrincipalDetails userDetails,
            @RequestBody ChatRoomNameRequestDto requestDto) {
        log.info("채팅방 이름 수정 컨트롤러 -> {}", userDetails.getUser().getUsername());
        ChatRoomInfoResponseDto result = chatRoomService.updateChatRoomName(roomId, userDetails.getUser(), requestDto);
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("채팅방 이름 수정 완료").data(result).build());
    }

    // 채팅방 삭제
    @DeleteMapping("/{roomId}")
    public ResponseEntity<ApiResponseDto> deleteChatRoom(@PathVariable("roomId") String roomId,
            @AuthenticationPrincipal PrincipalDetails userDetails) {
        log.info("채팅방 삭제 컨트롤러 -> {}", userDetails.getUser().getUsername());
        chatRoomService.deleteChatRoom(roomId, userDetails.getUser());
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("채팅방 삭제 완료!").build());
    }

    // 채팅방 멤버 조회
    @GetMapping("/{roomId}/members")
    public ResponseEntity<ApiResponseDto> getChatRoomMembers(@PathVariable("roomId") String roomId) {
        log.info("채팅방 멤버 조회 컨트롤러");
        MemberInfoListDto result = chatRoomService.getChatRoomMembers(roomId);
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("채팅방 멤버 조회 완료").data(result).build());

    }

    // 채팅방 나가기
    @DeleteMapping("/{roomId}/members")
    public ResponseEntity<ApiResponseDto> leaveChatRoom(@PathVariable("roomId") String roomId,
            @AuthenticationPrincipal PrincipalDetails userDetails) {
        log.info("채팅방 멤버 나가기 컨트롤러");
        chatRoomService.leaveChatRoom(roomId, userDetails.getUser());
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("채팅방 나가기 완료").build());
    }

    // // 해당 채팅방에 멤버 초대
    // @PostMapping("/{roomId}/members")
    // public ResponseEntity<ApiResponseDto> inviteMember(
    // @PathVariable String roomId,
    // @RequestBody NicknameListDto nicknameListDto,
    // @AuthenticationPrincipal PrincipalDetails userDetails) {
    // log.info("채팅방 멤버 초대 컨트롤러");
    // chatRoomService.inviteMember(roomId, nicknameListDto, userDetails.getUser());
    // return ResponseEntity.ok().body(ApiResponseDto.builder().message("채팅방 초대
    // 완료").build());
    // }

    // 내 채팅방 전체 조회
    @GetMapping("/myRooms")
    public ResponseEntity<ApiResponseDto> getMyChatRooms(@AuthenticationPrincipal PrincipalDetails userDetails) {
        log.info("내 채팅방 조회 컨트롤러 -> {}", userDetails.getUser().getUsername());
        MyChatRoomResponseDto result = chatRoomService.getMyChatRooms(userDetails.getUser());
        return ResponseEntity.ok().body(ApiResponseDto.builder().message("내 채팅방 전체 조회 완료").data(result).build());
    }
}
