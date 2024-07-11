import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import SockJS from 'sockjs-client';
import 'semantic-ui-css/semantic.min.css';
import './chat.css';
import { Button, Divider, Icon } from 'semantic-ui-react';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/ko';  // 한국어 로케일 추가

dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

dayjs.locale('ko');  // 한국어 로케일 설정

function Chat({ roomId, chatRoomName, setVisible, setButtonVisible }) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [roomName, setRoomName] = useState(chatRoomName);
    const [username, setUsername] = useState('');
    const [nickname, setNickname] = useState('');
    const clientRef = useRef(null);
    const [avatar, setAvatar] = useState('');
    const [scrollPosition, setScrollPosition] = useState(0);
    const [chatPosition, setChatPosition] = useState({ x: 0, y: 0 });
    const [darkMode, setDarkMode] = useState(false);
    const messageListRef = useRef(null);

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
                setVisible(null);
                setButtonVisible(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [setVisible, setButtonVisible]);

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
            scrollToBottom();
        }
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    }

    const scrollToBottom = () => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const formatDateHeader = (date) => {
        return <Divider horizontal>{dayjs(date).locale('ko').format('YYYY년 M월 D일 dddd')}</Divider>;
    };

    const renderMessages = () => {
        const groupedMessages = messages.reduce((acc, message) => {
            const messageDate = dayjs(message.createdAt, 'YY-MM-DD HH:mm').tz('Asia/Seoul').format('YYYY-MM-DD');
            if (!acc[messageDate]) {
                acc[messageDate] = [];
            }
            acc[messageDate].push(message);
            return acc;
        }, {});

        return Object.keys(groupedMessages).map((date, index) => (
            <div key={index}>
                <div className="date-header">{formatDateHeader(date)}</div>
                {groupedMessages[date].map((msg, msgIndex) => {
                    const isOutgoing = msg.sender === nickname;
                    return (
                        <div key={msgIndex}
                            className={`message ${isOutgoing ? 'message-outgoing' : 'message-incoming'}`}
                        >
                            {!isOutgoing && (
                                <Link to={`/blog/${msg.username}`}>
                                    <img src={process.env.PUBLIC_URL + '/images/' + msg.sender + '.jpg'} alt="Avatar"
                                        className="avatar" />
                                </Link>
                            )}
                            <div className="message-sender">{msg.sender}</div>
                            <div className="message-body">
                                <div className="message-content">
                                    <div className="message-text">{msg.message}</div>
                                    <div className="message-time">{dayjs(msg.createdAt, 'YY-MM-DD HH:mm').tz('Asia/Seoul').format('HH:mm')}</div>
                                </div>
                            </div>

                            {isOutgoing && (
                                <Link to={`/blog/${msg.username}`}>
                                    <img src={avatar} alt="Avatar"
                                        className="avatar" />
                                </Link>
                            )}
                        </div>
                    );
                })}
            </div>
        ));
    };

    return (
        <Draggable
            handle=".chat-header"
            position={chatPosition}
            onStop={(e, data) => setChatPosition({ x: data.x, y: data.y })}
        >
            <div className={`chat-container ${darkMode ? 'dark-mode' : ''}`}>
                <div className="chat-header">
                    <h2 className="roomName">{roomName}</h2>
                    <button className="close-button" onClick={() => { setVisible(null); setButtonVisible(true); }}>✖</button>
                </div>
                <div className="dark-mode-toggle">
                    <Button className="dark-mode-button"
                        style={{
                            backgroundColor: 'transparent',
                            marginRight: '30px',
                            marginTop: '19px',
                        }}
                        icon
                        onClick={() => setDarkMode(!darkMode)}>
                        <Icon name={darkMode ? 'sun' : 'moon'} />
                    </Button>
                </div>
                <div className="chat-content">
                    <div className="message-list" ref={messageListRef}>
                        {renderMessages()}
                    </div>
                    <div className="message-input-container">
                        <input
                            type="text"
                            placeholder="메시지 입력..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="message-input"
                        />
                        <Button icon className="send-button" onClick={sendMessage}><Icon name='send' /></Button>
                    </div>
                </div>
            </div>
        </Draggable>
    );
}

export default Chat;
