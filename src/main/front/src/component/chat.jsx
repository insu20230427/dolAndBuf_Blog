import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import Header from "./header";
import Footer from "./footer";
import Cookies from "js-cookie";
import axios from "axios";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import './chat.css';
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
} from "@chatscope/chat-ui-kit-react";
import { Button } from "semantic-ui-react";

function Chat() {
    const { roomId, chatRoomName } = useParams();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [roomName, setRoomName] = useState(chatRoomName);
    const [username, setUsername] = useState('');
    const clientRef = useRef(null);

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
                client.connectHeaders = { 'Authorization': token };
            },
            onConnect: () => {
                subscription = client.subscribe(`/topic/rooms/${roomId}`, (message) => {
                    const messageData = JSON.parse(message.body);
                    console.log("data 받아옴 : " + messageData)
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
        const fetchUser = async () => {
            try {
                const token = Cookies.get('Authorization');
                const payload = token.split('.')[1];
                const decoded = JSON.parse(atob(payload));
                setUsername(decoded.sub);
            } catch (error) {
                console.error('사용자 정보를 가져오는 데 실패했습니다:', error);
            }
        };
        fetchUser();
    }, []);

    const sendMessage = () => {

        const jwtToken = Cookies.get('Authorization');
        if (!jwtToken) {
            console.error('JWT Token not found');
            return;
        }

        const jwtParts = jwtToken.split(' ');
        if (jwtParts.length !== 2) {
            console.error('Invalid JWT Token format');
            return;
        }

        const token = jwtParts[1];

        // 토큰을 "."으로 분리하여 배열로 만듦
        const parts = token.split('.');

        // Payload 부분 추출 (인덱스 1)
        const payload = parts[1];

        // Base64 디코딩 후 JSON 파싱
        const username = JSON.parse(atob(payload)).sub;

        setUsername(username);

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
        <>
            <Header />
            <div className="chat-container" style={containerStyle}>
                <div className="chat-header">
                    <h2>{roomName}</h2>
                    <Button className="update-room-button" onClick={updateRoomName}>채팅방 이름 수정</Button>
                </div>
                <div className="message-list">
                    <MainContainer>
                        <ChatContainer>
                            <MessageList>
                                {Array.isArray(messages) && messages.map((msg, index) => (
                                    <Message
                                        key={index}
                                        model={{
                                            message: msg.message,
                                            sentTime: msg.sentTime,
                                            sender: msg.sender,
                                            direction: msg.sender === username ? "outgoing" : "incoming"
                                        }}
                                        className={msg.sender === username ? "message-outgoing" : "message-incoming"}
                                    />
                                ))}
                            </MessageList>
                            <MessageInput
                                placeholder="메시지 입력..."
                                value={message}
                                onChange={(val) => setMessage(val)}
                                attachButton={false}
                                onSend={sendMessage}
                            />
                        </ChatContainer>
                    </MainContainer>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Chat;