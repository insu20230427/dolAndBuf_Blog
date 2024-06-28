import {ChatContainer, MainContainer, Message, MessageInput, MessageList,} from "@chatscope/chat-ui-kit-react";
import {Client} from "@stomp/stompjs";
import axios from "axios";
import Cookies from "js-cookie";
import React, {useEffect, useRef, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {Button} from "semantic-ui-react";
import SockJS from "sockjs-client";
import './chat.css';
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

function Chat() {
    const {roomId, chatRoomName} = useParams();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [roomName, setRoomName] = useState(chatRoomName);
    const [username, setUsername] = useState('');
    const [nickname, setNickname] = useState('');
    const clientRef = useRef(null);
    const [avatar, setAvatar] = useState('');

    const containerStyle = {
        height: '87vh'
    }

    useEffect(() => {
        let subscription;
        let token = Cookies.get('Authorization');
        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log('STOMP: ' + str),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            beforeConnect: () => {
                client.connectHeaders = {'Authorization': token};
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
                // 배열인지 확인하고, 배열이 아니면 빈 배열을 사용
                setMessages(Array.isArray(chatMessageDtoList) ? chatMessageDtoList : []);
            } catch (error) {
                console.error('채팅 기록을 가져오는 데 실패했습니다:', error);
                setMessages([]); // 오류 발생 시 빈 배열 설정
            }
        };
        fetchChatHistory();
    }, [roomId]);

    useEffect(() => {
        fetchUser();
    }, []);

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
            // Base64 URL 디코딩
            const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
            const binaryString = atob(base64);
            const bytes = Uint8Array.from(binaryString, c => c.charCodeAt(0));
            const jsonPayload = new TextDecoder().decode(bytes);

            const claims = JSON.parse(jsonPayload);
            const username = claims.sub;
            const nickname = claims.nickname;
            console.log("username : " + username)
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
            // 서버에 새로운 채팅방 이름 업데이트 요청 보내기
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
        <div className="chat-container" style={containerStyle}>
            <div className="chat-header">
                <h2>{roomName}</h2>
                <button className="update-room-button" onClick={updateRoomName}>채팅방 이름 수정</button>
            </div>
            <div className="message-list">
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
                        <div className="message-input-container">
                            <MessageInput
                                placeholder="메시지 입력..."
                                value={message}
                                onChange={(val) => setMessage(val)}
                                attachButton={false}
                                onSend={sendMessage}
                            />
                            <button onClick={sendMessage}>✉️</button>
                        </div>

                        <MessageInput
                            placeholder="메시지 입력..."
                            value={message}
                            onChange={(val) => setMessage(val)}
                            attachButton={false}
                            onSend={sendMessage}
                            className="message-input-container"
                        />
                    </ChatContainer>
                </MainContainer>
            </div>
        </div>
    );
};

export default Chat;