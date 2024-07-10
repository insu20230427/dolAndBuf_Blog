import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { ChatContainer, MainContainer, Message, MessageInput, MessageList } from '@chatscope/chat-ui-kit-react';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import SockJS from 'sockjs-client';
import 'semantic-ui-css/semantic.min.css';
import './chat.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

function Chat({ roomId, chatRoomName, setShowChat }) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [roomName, setRoomName] = useState(chatRoomName);
    const [username, setUsername] = useState('');
    const [nickname, setNickname] = useState('');
    const clientRef = useRef(null);
    const [avatar, setAvatar] = useState('');
    const [scrollPosition, setScrollPosition] = useState(0);
    const [chatPosition, setChatPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setScrollPosition(scrollTop * 1.17);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        setChatPosition({ x: 30, y: 30 }); // 기본 위치 설정
    }, []);

    useEffect(() => {
        setChatPosition((prevPosition) => ({
            ...prevPosition,
            y: scrollPosition,
        }));
    }, [scrollPosition]);

    useEffect(() => {
        let subscription;
        const token = Cookies.get('Authorization');
        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log('STOMP: ' + str),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            beforeConnect: () => {
                client.connectHeaders = { 'Authorization': token };
            },
            onConnect: () => {
                subscription = client.subscribe(`/topic/rooms/${roomId}`, (message) => {
                    const messageData = JSON.parse(message.body);
                    console.log("data 받아옴:", JSON.stringify(messageData, null, 2));
                    setMessages(prevMessages => [...prevMessages, messageData]);
                });
            }
        });
        clientRef.current = client;
        client.activate();

        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
            client.deactivate();
        };
    }, [roomId]);

    useEffect(() => {
        setRoomName(chatRoomName);
    }, [chatRoomName]);

    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/chatRooms/${roomId}`, {
                    headers: {
                        'Authorization': Cookies.get('Authorization')
                    }
                });
                const chatMessageDtoList = response.data.data;
                setMessages(Array.isArray(chatMessageDtoList) ? chatMessageDtoList : []);
            } catch (error) {
                console.error('채팅 기록을 가져오는 데 실패했습니다:', error);
                setMessages([]);
            }
        };
        fetchChatHistory();
    }, [roomId]);

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setShowChat(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [setShowChat]);

    const fetchUser = async () => {
        try {
            const validToken = Cookies.get('Authorization');
            const jwtParts = validToken.split(' ');
            if (jwtParts.length !== 2) {
                console.error('Invalid JWT Token format');
                return;
            }

            const token = jwtParts[1];
            const parts = token.split('.');
            if (parts.length !== 3) {
                console.error('Invalid JWT Token structure');
                return;
            }

            const payload = parts[1];
            const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
            const binaryString = atob(base64);
            const bytes = Uint8Array.from(binaryString, c => c.charCodeAt(0));
            const jsonPayload = new TextDecoder().decode(bytes);

            const claims = JSON.parse(jsonPayload);
            const username = claims.sub;
            const nickname = claims.nickname;
            console.log("username : " + username);
            setAvatar(process.env.PUBLIC_URL + '/images/' + nickname + '.jpg');
            setUsername(username);
            setNickname(nickname);
        } catch (error) {
            console.error('사용자 정보를 가져오는 데 실패했습니다:', error);
        }
    };

    const sendMessage = () => {
        if (message) {
            const messageData = {
                roomId: roomId,
                message: message,
                sender: username
            };
            clientRef.current.publish({
                destination: `/app/chat/${roomId}/send`,
                headers: {
                    'Authorization': Cookies.get('Authorization')
                },
                body: JSON.stringify(messageData)
            });
            setMessage('');
        }
    }

    const updateRoomName = () => {
        const newRoomName = prompt('새로운 채팅방 이름을 입력하세요:', chatRoomName);
        if (newRoomName) {
            setRoomName(newRoomName);
            axios.put(`http://localhost:8080/api/chatRooms/${roomId}`, {
                newChatRoomName: newRoomName
            }, {
                headers: {
                    'Authorization': Cookies.get('Authorization')
                }
            }).then(response => {
                console.log('채팅방 이름 수정 완료:', response.data);
            }).catch(error => {
                console.error('채팅방 이름 수정 실패:', error);
            });
        }
    };

    return (
        <Draggable
            position={chatPosition}
            onStop={(e, data) => setChatPosition({ x: data.x, y: data.y })}
        >
            <div className="chat-container">
                <div className="chat-header">
                    <h2>{roomName}</h2>
                </div>
                <MainContainer>
                    <ChatContainer>
                        <MessageList>
                            {Array.isArray(messages) && messages.map((msg, index) => {
                                const isOutgoing = msg.sender === nickname;

                                return (
                                    <div key={index}
                                         style={{
                                             display: 'flex',
                                             alignItems: 'center',
                                             marginTop: '10px',
                                             marginBottom: '10px',
                                             justifyContent: isOutgoing ? 'flex-end' : 'flex-start'
                                         }}
                                    >
                                        {!isOutgoing && (
                                            <Link to={`/blog/${msg.username}`}>
                                                <img src={process.env.PUBLIC_URL + '/images/' + msg.sender + '.jpg'} alt="Avatar"
                                                     style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '5px' }} />
                                            </Link>
                                        )}
                                        <Message
                                            model={{
                                                message: msg.message,
                                                sentTime: msg.sentTime,
                                                sender: msg.sender,
                                                direction: isOutgoing ? "outgoing" : "incoming"
                                            }}
                                            className={isOutgoing ? "message-outgoing" : "message-incoming"}
                                        />
                                        {isOutgoing && (
                                            <Link to={`/blog/${msg.username}`}>
                                                <img src={avatar} alt="Avatar"
                                                     style={{ width: '30px', height: '30px', borderRadius: '50%', marginLeft: '5px' }} />
                                            </Link>
                                        )}
                                    </div>
                                );
                            })}
                        </MessageList>
                        <MessageInput
                            placeholder="메시지 입력..."
                            value={message}
                            onChange={(val) => setMessage(val)}
                            attachButton={false}
                            onSend={sendMessage}
                        />
                        <button onClick={sendMessage}>✉️</button>
                    </ChatContainer>
                </MainContainer>
            </div>
        </Draggable>
    );
};

export default Chat;
