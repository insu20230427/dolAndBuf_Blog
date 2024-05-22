import { Client } from '@stomp/stompjs';
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Container, Form, Grid, Icon, Input, List, Modal, Header as SemanticHeader } from 'semantic-ui-react';
import SockJS from 'sockjs-client';

const ChatApp = () => {

    const containerStyle = {
        height: '87vh'
    }

    const [rooms, setRooms] = useState([]);
    const [newRoomName, setNewRoomName] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUserIds, setSelectedUserIds] = useState([]); // 선택된 사용자들의 ID를 저장
    const [memberId, setMemberId] = useState('');
    const clientRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = Cookies.get('Authorization');
        fetchRooms();
        const socket = new SockJS("http://localhost:8080/ws");
        const stompClient = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log('STOMP: ' + str),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            beforeConnect: () => {
                stompClient.connectHeaders = {'Authorization': accessToken};
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
            // 중복 제거 로직
            const uniqueRooms = response.data.data.myChatRoomList.filter((room, index, self) =>
                index === self.findIndex((r) => r.chatRoomId === room.chatRoomId)
            );
            setRooms(uniqueRooms);
        } catch (error) {
            console.error('채팅방 목록을 가져오는 데 실패했습니다:', error);
        }
    };

    const createRoom = async () => {

        if (!newRoomName) {
            alert("채팅방 이름을 입력해주세요.");
            return;
        }
        if (selectedUserIds.length === 0) {
            alert("멤버를 추가해주세요.");
            return;
        }

        try {
            await axios.post('http://localhost:8080/api/chatRooms', {
                chatRoomName: newRoomName,
                memberIdList: selectedUserIds
            }, {
                headers: {
                    'Authorization': Cookies.get('Authorization')
                }
            });
            setNewRoomName('');
            setSelectedUserIds([]);
            setModalOpen(false);
            await fetchRooms();
        } catch (error) {
            console.error('채팅방 생성 실패:', error);
            alert('채팅방 생성에 실패했습니다.');
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

    const handleSelectRoom = (roomId, chatRoomName) => {
        navigate(`/room/${roomId}/${chatRoomName}`);
    };

    return (
        <>
            <br/><br/><br/>
            <Container style={containerStyle}>
                <SemanticHeader as='h2' textAlign='center'>채팅방 목록</SemanticHeader>
                <br/><br/> <br/><br/>
                <Grid columns={3} stackable>
                    {rooms && rooms.length > 0 && rooms.map((room, index) => (
                        <Grid.Column key={index}>
                            <Card>
                                <Card.Content>
                                    <Card.Header>{room.chatRoomName}</Card.Header>
                                    <Card.Meta>{`Room ID: ${room.chatRoomId}`}</Card.Meta>
                                </Card.Content>
                                <Card.Content extra>
                                    <Button.Group widths='3'>
                                        <Button basic color='green'
                                                onClick={() => handleSelectRoom(room.chatRoomId, room.chatRoomName)}>
                                            입장
                                        </Button>
                                        <Button basic color='red' onClick={() => deleteRoom(room.chatRoomId)}>
                                            삭제
                                        </Button>
                                        <Button basic color='yellow' onClick={() => leaveRoom(room.chatRoomId)}>
                                            나가기
                                        </Button>
                                    </Button.Group>
                                </Card.Content>
                            </Card>
                            <br/><br/>
                        </Grid.Column>
                    ))}
                </Grid>

                <div style={{textAlign: 'center', marginTop: '20px'}}>
                    <Button
                        primary
                        onClick={() => setModalOpen(true)}
                        icon
                        labelPosition='right'
                        size='large'
                        style={{marginTop: '20px'}}
                    >
                        <Icon name='plus'/>
                        채팅방 생성
                    </Button>
                </div>
                <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                    <Modal.Header>채팅방 생성</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Field>
                                <Input
                                    placeholder="채팅방 이름"
                                    value={newRoomName}
                                    onChange={(e) => setNewRoomName(e.target.value)}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Input
                                    placeholder="멤버 ID 입력..."
                                    value={memberId}
                                    onChange={(e) => setMemberId(e.target.value)}
                                />
                            </Form.Field>
                            <Button type="button" onClick={() => {
                                if (memberId) {
                                    setSelectedUserIds([...selectedUserIds, memberId]);
                                    setMemberId('');
                                }
                            }} style={{marginBottom: '10px'}}>멤버 추가</Button>
                            <List>
                                {selectedUserIds.map((id, index) => (
                                    <List.Item key={index}>
                                        <Icon name='user'/> {id}
                                    </List.Item>
                                ))}
                            </List>
                            <Button type="button" primary onClick={createRoom}>
                                생성
                            </Button>
                        </Form>
                    </Modal.Content>
                </Modal>
            </Container>
        </>
    );
};

export default ChatApp;