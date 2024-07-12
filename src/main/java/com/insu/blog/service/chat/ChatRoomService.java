package com.insu.blog.service.chat;

import com.insu.blog.dto.chat.ChatMessageDto;
import com.insu.blog.dto.chatRoom.*;
import com.insu.blog.dto.response.ApiResponseDto;
import com.insu.blog.entity.User;
import com.insu.blog.entity.chat.ChatMessage;
import com.insu.blog.entity.chat.ChatRoom;
import com.insu.blog.entity.chat.ChatUser;
import com.insu.blog.repository.UserRepository;
import com.insu.blog.repository.chat.ChatMessageRepository;
import com.insu.blog.repository.chat.ChatRoomRepository;
import com.insu.blog.repository.chat.ChatUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j(topic = "ChatRoomService")
@RequiredArgsConstructor
public class ChatRoomService {

    private final UserRepository userRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatUserRepository chatUserRepository;
    private final ChatMessageRepository chatMessageRepository;
    // private static final int MESSAGE_PAGE_SIZE = 35;

    // 유저 간의 채팅방 조회
    private Optional<ChatRoom> findChatRoomBetweenUsers(User user1, String nickname) {
        User user2 = userRepository.findByNickname(nickname).orElseThrow(
                () -> new NullPointerException("존재하지 않는 사용자입니다."));
        return chatRoomRepository.findChatRoomByUsers(user1, user2);
    }

    // 채팅방 생성 또는 가져오기
    @Transactional
    public ChatRoomInfoResponseDto createOrGetChatRoom(User user1, CreateChatRoomRequestDto req) {
        User otherUser = userRepository.findByNickname(req.getNickname()).orElse(null);

        Optional<ChatRoom> existingChatRoom = findChatRoomBetweenUsers(user1, req.getNickname());
        if (existingChatRoom.isPresent()) {
            return new ChatRoomInfoResponseDto(existingChatRoom.get());
        } else {
            return createChatRoom(user1, req);
        }
    }

    // 채팅방 생성
    @Transactional
    public ChatRoomInfoResponseDto createChatRoom(User user, CreateChatRoomRequestDto req) {
        ChatRoom newChatRoom = new ChatRoom(user.getNickname(), req.getChatRoomName());
        chatRoomRepository.save(newChatRoom);

        Set<User> userList = new HashSet<>(dtoToUserList(user, req.getNickname()));

        // 사용자와 상대방을 채팅방에 초대
        for (User u : userList) {
            ChatUser chatUser = new ChatUser(u, newChatRoom);
            if (!chatUserRepository.existsByChatRoomAndUser(newChatRoom, u)) {
                chatUserRepository.save(chatUser);
            }
        }

        chatRoomRepository.save(newChatRoom);

        return new ChatRoomInfoResponseDto(newChatRoom);
    }

    // 채팅방 채팅 기록 조회
    public List<ChatMessageDto> getChatRoomChatMessages(String roomId, User user) {
        ChatRoom chatRoom = findChatRoomById(Integer.parseInt(roomId));
        ChatUser chatUser = findChatUserByChatRoomAndUser(chatRoom, user);

        // 입장한 후의 모든 메세지를 조회할 수 있도록 페이지 관련 설정을 제거
        List<ChatMessage> chatMessages = chatMessageRepository
                .findAllByChatRoomIdAndCreatedAtGreaterThanEqual(Integer.parseInt(roomId), chatUser.getCreatedAt());

        return chatMessages.stream()
                .map(ChatMessageDto::new)
                .toList();
    }

    // 채팅방 이름 수정
    @Transactional
    public ChatRoomInfoResponseDto updateChatRoomName(String chatRoomId, User user, ChatRoomNameRequestDto requestDto) {
        // 요청한 user가 채팅방의 생성자인지 확인
        ChatRoom chatRoom = findChatRoomById(Integer.parseInt(chatRoomId));

        if (!(Objects.equals(chatRoom.getHostNickname(), user.getNickname()))) {
            throw new IllegalArgumentException("채팅방의 이름은 호스트만 변경할 수 있습니다.");
        }

        chatRoom.updateChatRoomName(requestDto.getNewChatRoomName());
        return new ChatRoomInfoResponseDto(chatRoom);
    }

    // 채팅방 삭제
    public void deleteChatRoom(String chatRoomId, User user) {
        // 요청한 user가 채팅방의 생성자인지 확인
        ChatRoom chatRoom = findChatRoomById(Integer.parseInt(chatRoomId));

        if (!(Objects.equals(chatRoom.getHostNickname(), user.getNickname()))) {
            throw new IllegalArgumentException("채팅방은 호스트만 삭제할 수 있습니다.");
        }
        chatRoomRepository.delete(chatRoom);
    }

    // 채팅방 멤버 조회
    public MemberInfoListDto getChatRoomMembers(String chatRoomId) {

        ChatRoom chatRoom = findChatRoomById(Integer.parseInt(chatRoomId));

        List<ChatMemberInfoDto> chatMemberInfoList = chatUserRepository
                .findAllByChatRoom(chatRoom)
                .stream()
                .map(ChatMemberInfoDto::new).toList();

        return new MemberInfoListDto(chatMemberInfoList);
    }

    // 사용자가 속한 채팅방 전체 조회
    // public MyChatRoomResponseDto getMyChatRooms(User user) {
    // List<ChatRoomInfoResponseDto> myChatRoomList = chatUserRepository
    // .findAllByUser(user)
    // .stream()
    // .map(ChatUser::getChatRoom)
    // .map(ChatRoomInfoResponseDto::new).toList();
    // return new MyChatRoomResponseDto(myChatRoomList);
    // }

    public MyChatRoomResponseDto getMyChatRooms(User user) {
        List<ChatRoomInfoResponseDto> myChatRoomList = chatUserRepository
                .findAllByUser(user)
                .stream()
                .map(ChatUser::getChatRoom)
                .map(chatRoom -> {
                    List<UserInfoDto> users = chatRoom.getChatUserList().stream()
                            .map(ChatUser::getUser)
                            .map(UserInfoDto::new)
                            .collect(Collectors.toList());
                    return new ChatRoomInfoResponseDto(chatRoom, users);
                }).collect(Collectors.toList());
        return new MyChatRoomResponseDto(myChatRoomList);
    }

    // 채팅방 나가기
    public void leaveChatRoom(String roomId, User user) {
        ChatRoom chatRoom = findChatRoomById(Integer.parseInt(roomId));
        ChatUser chatUser = findChatUserByChatRoomAndUser(chatRoom, user);

        if (chatUser == null) {
            throw new IllegalArgumentException("해당 채팅방에 속해있지 않습니다.");
        }

        // user가 해당 채팅방의 host인 경우 채팅방 삭제
        if (Objects.equals(chatRoom.getHostNickname(), user.getNickname())) {
            deleteChatRoom(roomId, user);
        }

        // user가 해당 채팅방의 host가 아니면 방만 나가기
        chatUserRepository.delete(chatUser);
    }

    // // 해당 채팅방에 멤버 초대
    // public void inviteMember(String roomId, NicknameListDto nicknameListDto, User
    // user) {
    // ChatRoom chatRoom = findChatRoomById(Integer.parseInt(roomId));
    // ChatUser chatUser = findChatUserByChatRoomAndUser(chatRoom, user);

    // if (chatUser == null) {
    // throw new IllegalArgumentException("해당 채팅방으로의 초대 권한이 없습니다.");
    // }

    // List<User> userList = new ArrayList<>();
    // for (ChatNicknameDto cmd : nicknameListDto.getNicknameList()) {
    // User newUser = userRepository.findByNickname(cmd.getNickname()).orElseThrow(
    // () -> new NullPointerException("존재하지 않는 사용자입니다.")
    // );
    // userList.add(newUser);
    // }
    // for (User u : userList) {
    // // 만약 이미 채팅방에 존재하는 멤버라면 건너뛰기
    // if (findChatUserByChatRoomAndUser(chatRoom, u) != null) {
    // continue;
    // }
    // chatUserRepository.save(new ChatUser(u, chatRoom));
    // }
    // }
    public List<User> dtoToUserList(User user, String nickname) {
        List<User> userList = new ArrayList<>();
        // 예시로, user 객체의 nickname과 인자로 받은 nickname을 리스트에 추가
        List<String> nicknames = Arrays.asList(user.getNickname(), nickname);

        for (String nick : nicknames) {
            userRepository.findByNickname(nick).ifPresent(userList::add);
        }

        if (userList.isEmpty()) {
            throw new NullPointerException("존재하지 않는 사용자입니다.");
        }

        return userList;
    }

    // 존재하는 사용자인지 조회
    public List<User> dtoToUserList(List<ChatNicknameDto> nicknameList) {
        log.info(nicknameList.get(0).toString());
        // 전달받은 사용자 리스트
        List<User> userList = new ArrayList<>();
        for (ChatNicknameDto cmd : nicknameList) {
            User user = userRepository.findByNickname(cmd.getNickname()).orElseThrow(
                    () -> new NullPointerException("존재하지 않는 사용자입니다."));
            userList.add(user);
        }
        return userList;
    }

    public ChatRoom findChatRoomById(int chatRoomId) {
        return chatRoomRepository.findById(chatRoomId).orElseThrow(
                () -> new NullPointerException("존재하지 않는 채팅방입니다."));
    }

    public ChatUser findChatUserByChatRoomAndUser(ChatRoom chatRoom, User user) {
        return chatUserRepository.findByChatRoomAndUser(chatRoom, user);
    }
}