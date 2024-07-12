import { Client } from '@stomp/stompjs';
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import 'semantic-ui-css/semantic.min.css';
import { Button, Header, Icon, Image, List, Divider } from 'semantic-ui-react';
import SockJS from 'sockjs-client';
import Chat from './chat';
import './ChatApp.css';

const ChatApp = () => {
    const [visible, setVisible] = useState(false);
    const [buttonVisible, setButtonVisible] = useState(true);
    const [chatPosition, setChatPosition] = useState({ x: 0, y: 0 });
    const [scrollPosition, setScrollPosition] = useState(0);
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const clientRef = useRef(null);
    const [currentNickname, setCurrentNickname] = useState('');

    useEffect(() => {
        const accessToken = Cookies.get('Authorization');
        if (accessToken) {
            const jwtToken = accessToken.split(' ')[1];
            const parts = jwtToken.split('.');
            const payload = parts[1];
            const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
            const decodedPayloadRaw = window.atob(base64);
            const utf8Decoder = new TextDecoder('utf-8');
            const decodedPayloadArray = new Uint8Array(Array.from(decodedPayloadRaw).map(char => char.charCodeAt(0)));
            const decodedPayload = JSON.parse(utf8Decoder.decode(decodedPayloadArray));
            console.log('Decoded Payload: ' + JSON.stringify(decodedPayload));
            setCurrentNickname(decodedPayload.nickname);
        }

        fetchRooms();
        const socket = new SockJS("http://localhost:8080/ws");
        const stompClient = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log('STOMP: ' + str),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            beforeConnect: () => {
                stompClient.connectHeaders = { 'Authorization': accessToken };
            },
            onConnect: (frame) => {
                console.log('Connected: ' + frame);
            }
        });

        stompClient.activate();
        clientRef.current = stompClient;

        return () => {
            stompClient.deactivate();
        };
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/chatRooms/myRooms', {
                headers: {
                    'Authorization': Cookies.get('Authorization')
                }
            });
            const uniqueRooms = response.data.data.myChatRoomList.filter((room, index, self) =>
                index === self.findIndex((r) => r.chatRoomId === room.chatRoomId)
            );
            setRooms(uniqueRooms);
        } catch (error) {
            console.error('채팅방 목록을 가져오는 데 실패했습니다:', error);
        }
    };

    const deleteRoom = async (roomId) => {
        try {
            await axios.delete(`http://localhost:8080/api/chatRooms/${roomId}`, {
                headers: {
                    'Authorization': Cookies.get('Authorization')
                }
            });
            await fetchRooms();
        } catch (error) {
            console.error('채팅방 삭제 실패:', error);
            alert('채팅방 삭제에 실패했습니다.');
        }
    };

    const leaveRoom = async (roomId) => {
        try {
            await axios.delete(`http://localhost:8080/api/chatRooms/${roomId}/members`, {
                headers: {
                    'Authorization': Cookies.get('Authorization')
                }
            });
            await fetchRooms();
        } catch (error) {
            console.error('채팅방 나가기 실패:', error);
            alert('채팅방 나가기에 실패했습니다.');
        }
    };

    const handleSelectRoom = (room) => {
        setSelectedRoom(room);
        setVisible(false);
        setButtonVisible(false);
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setScrollPosition(scrollTop * 1.17);
        };

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                if (selectedRoom) {
                    setSelectedRoom(null);
                } else if (visible) {
                    setVisible(false);
                    setButtonVisible(true);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedRoom, visible]);

    useEffect(() => {
        if (visible) {
            setChatPosition((prevPosition) => ({
                ...prevPosition,
                y: scrollPosition,
            }));
        }
    }, [scrollPosition, visible]);

    const toggleChat = () => {
        setVisible(!visible);
        setButtonVisible(false);
    };

    return (
        <div>
            {buttonVisible && (
                <Button
                    id="chatButton"
                    size="huge"
                    icon
                    style={{
                        backgroundColor: 'transparent',
                        color: 'black',
                        right: '30px',
                        zIndex: 1000,
                        borderRadius: '50%',
                        width: '60px',
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'fixed',
                        transition: 'transform 0.6s ease-out',
                        transform: `translateY(${scrollPosition}px)`,
                    }}
                    onClick={toggleChat}
                >
                    <Icon name="chat" />
                </Button>
            )}

            {visible && !selectedRoom && (
                <Draggable
                    position={chatPosition}
                    onStop={(e, data) => setChatPosition({ x: data.x, y: data.y })}
                >
                    <div className="chatList-container">
                        <div className="chatList-header">
                            <Header as='h3'>1:1 대화</Header>
                            <button className='chatList-close-button' onClick={() => { setVisible(false); setButtonVisible(true); }}>✖</button>                               
                        </div>
                        <Divider className="custom-divider" />
                        {rooms && rooms.length > 0 && rooms.map((room, index) => {
                            room.users.forEach(user => console.log(`Room ID: ${room.chatRoomId}, Nickname: ${user.nickname}`));
                            console.log('Current Nickname: ' + currentNickname);
                            const firstOtherUser = room.users.find(user => user.nickname !== currentNickname);
                            const imagePath = firstOtherUser ? `${process.env.PUBLIC_URL}/images/${firstOtherUser.nickname}.jpg` : `${process.env.PUBLIC_URL}/images/default.jpg`;

                            return (
                                <List selection verticalAlign="middle" key={index}>
                                    <List.Item onClick={() => handleSelectRoom(room)}>
                                        <Image avatar src={imagePath} />
                                        <List.Content>
                                            {/* <List.Header>{room.chatRoomName}</List.Header> */}
                                            <List.Description>대화 상대: {firstOtherUser ? firstOtherUser.nickname : '알 수 없음'}</List.Description>
                                        </List.Content>
                                    </List.Item>
                                </List>
                            );
                        })}
                    </div>
                </Draggable>
            )}

            {selectedRoom && (
                <Chat
                    roomId={selectedRoom.chatRoomId}
                    chatRoomName={selectedRoom.chatRoomName}
                    setVisible={setSelectedRoom}
                    setButtonVisible={setButtonVisible}
                />
            )}
        </div>
    );
};

export default ChatApp;
