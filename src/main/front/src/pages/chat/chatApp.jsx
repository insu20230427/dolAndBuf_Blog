import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Button, Icon, List } from 'semantic-ui-react';

const ChatApp = () => {
    const [visible, setVisible] = useState(false);
    const [ButtonVisible, setButtonVisible] = useState(true);
    const [chatPosition, setChatPosition] = useState({ x: 0, y: 0 });
    const [scrollPosition, setScrollPosition] = useState(100);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setScrollPosition(scrollTop * 1.17);
        };

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setVisible(false);
                setButtonVisible(true);
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

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
        setButtonVisible(visible); // visible 상태를 반대로 하여 버튼 가시성 제어
    };

    return (
        <div>
            {ButtonVisible && (
                <Button
                    id="chatButton"
                    size='huge'
                    style={{
                        backgroundColor: 'transparent',
                        transition: 'transform 0.6s ease-out',
                        transform: `translateY(${scrollPosition}px)`,
                    }}
                    onClick={toggleChat}
                >
                    <Icon name="chat" />
                </Button>
            )}

            {visible && (
                <Draggable
                    position={chatPosition}
                    onStop={(e, data) => setChatPosition({ x: data.x, y: data.y })}
                >
                    <div
                        style={{
                            right: '30px',
                            bottom: '30px',
                            width: '350px',
                            height: '500px',
                            backgroundColor: 'white',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                            padding: '20px',
                            overflowY: 'scroll',
                            zIndex: 1000,
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3>Chat Rooms</h3>
                            <Button icon="close" onClick={toggleChat} />
                        </div>
                        <List selection verticalAlign='middle'>
                            <List.Item>
                                <Icon name='user' />
                                <List.Content>
                                    <List.Header>User 1</List.Header>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <Icon name='user' />
                                <List.Content>
                                    <List.Header>User 2</List.Header>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <Icon name='user' />
                                <List.Content>
                                    <List.Header>User 3</List.Header>
                                </List.Content>
                            </List.Item>
                            {/* 추가적인 채팅방 목록 */}
                        </List>
                    </div>
                </Draggable>
            )}
        </div>
    );
};

export default ChatApp;
