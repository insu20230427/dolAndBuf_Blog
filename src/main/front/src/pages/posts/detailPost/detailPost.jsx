import React, { useEffect, useState } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Container, Divider, Dropdown, Icon, Label } from "semantic-ui-react";
import Swal from "sweetalert2";
import Reply from "../../../components/Reply";
import Chat from "../../chat/chat";
import './detailPost.css';

const DetailPost = () => {
    const [detailPost, setDetailPost] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [avatar, setAvatar] = useState('');
    const [showChat, setShowChat] = useState(false);
    const [chatRoomId, setChatRoomId] = useState(null);
    const [chatRoomName, setChatRoomName] = useState('');

    useEffect(() => {
        const storedToken = Cookies.get('Authorization');
        if (storedToken) {
            const jwtToken = storedToken.split(' ')[1];
            const parts = jwtToken.split('.');
            const payload = parts[1];
            const decodedPayload = JSON.parse(atob(payload));
            setUserId(decodedPayload.userId);
        }

        fetchPost();
    }, []);

    useEffect(() => {
        if (detailPost.user) {
            setAvatar(process.env.PUBLIC_URL + '/images/' + detailPost.user.nickname + '.jpg');
        }
    }, [detailPost]);

    const fetchPost = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/posts/${id}`);
            setDetailPost(response.data.data);
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    };

    const handleDeletePost = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/posts/${id}`, {
                headers: {
                    'Authorization': Cookies.get('Authorization')
                }
            });
            Swal.fire({
                icon: 'success',
                text: '게시글 삭제 성공.'
            }).then(() => {
                navigate('/');
            });
        } catch (error) {
            console.error('게시글 삭제 실패:', error);
            await Swal.fire({
                icon: 'error',
                text: '게시글 삭제 실패.'
            });
        }
    };

    const addLikePost = async () => {
        try {
            const response = await axios.post(`http://localhost:8080/api/posts/likes/${id}`, {}, {
                headers: {
                    'Authorization': Cookies.get('Authorization')
                }
            });
            const userId = response.data.data;
            localStorage.setItem(`post_${id}_liked_${userId}`, 'true');
            await fetchPost();
        } catch (error) {
            console.error('좋아요 실패:', error);
            await Swal.fire({
                icon: 'warning',
                text: '좋아요 실패.'
            });
        }
    };

    const deleteLikePost = async () => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/posts/likes/${id}`, {
                headers: {
                    'Authorization': Cookies.get('Authorization')
                }
            });
            const userId = response.data.data;
            localStorage.setItem(`post_${id}_liked_${userId}`, 'false');
            await fetchPost();
        } catch (error) {
            console.error('좋아요 삭제 실패:', error);
            await Swal.fire({
                icon: 'warning',
                text: '좋아요 삭제 실패.'
            });
        }
    };

    const createChatRoom = async () => {
        try {
            const chatRoomName = detailPost.user.nickname;
            const nickname = detailPost.user.nickname;
            const response = await axios.post('http://localhost:8080/api/chatRooms/between', {
                chatRoomName: chatRoomName,
                nickname: nickname
            }, {
                headers: {
                    'Authorization': Cookies.get('Authorization')
                }
            });

            const chatRoomId = response.data.data.chatRoomId;
            setChatRoomId(chatRoomId);
            setChatRoomName(chatRoomName);
            setShowChat(true);
        } catch (error) {
            console.error('채팅방 생성 실패:', error);
            await Swal.fire({
                icon: 'error',
                text: '채팅방 생성 실패.'
            });
        }
    };

    return (
       <div style={{ display: 'flex', position: 'relative' }}>
            <Container>
                <br /><br /><br /><br />
                <div style={{ marginBottom: '10px' }}>
                    {detailPost.user && (
                        <>
                            <div className="user-info-container">
                                <Dropdown
                                    trigger={
                                        <img src={avatar} alt="Avatar"
                                            style={{ marginRight: '5px', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer' }}
                                        />
                                    }
                                    pointing="right"
                                    icon={null}
                                >
                                    <Dropdown.Menu>
                                        <Dropdown.Item text="1:1 대화" icon="chat" onClick={createChatRoom} />
                                        <Dropdown.Item text="블로그" icon="book" onClick={() => navigate(`/blog/${detailPost.user.username}`)} />
                                    </Dropdown.Menu>
                                </Dropdown>
                                <div className="user-info">
                                    {detailPost.user.nickname}({detailPost.user.username})
                                </div>
                                <Dropdown
                                    icon="ellipsis vertical"
                                    className="kebob-dropdown"
                                    pointing="left">
                                    <Dropdown.Menu>
                                        {userId && String(userId) === String(detailPost.user.id) && (
                                            <>
                                                <Dropdown.Item text="수정" icon="edit" onClick={() => navigate(`/update-post/${id}`)} />
                                                <Dropdown.Item text="삭제" icon="trash alternate" onClick={handleDeletePost} />
                                            </>
                                        )}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </>
                    )}
                </div>
                <h1 style={{ marginRight: '50px' }}>{detailPost.title}</h1>
                <br />
                <div style={{ marginBottom: '10px' }}>
                    {detailPost.category && (
                        <Label tag>
                            {detailPost.category.name}
                        </Label>
                    )}
                </div>
                <Divider />
                <div style={{ marginTop: '50px' }}>
                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(detailPost.content) }} />
                </div>
                <br /><br /><br /><br /><br /><br />
                <div className="ui labeled button" tabIndex="0">
                    {localStorage.getItem(`post_${id}_liked_${userId}`) === "true" ? (
                        <>
                            <Button as='div' labelPosition='right'>
                                <Button icon color='red' onClick={deleteLikePost}>
                                    <Icon name='heart' />
                                </Button>
                                <Label basic color='red' pointing='left'>
                                    {detailPost.likeCnt}
                                </Label>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button as='div' labelPosition='right'>
                                <Button icon onClick={addLikePost}>
                                    <Icon name='heart' />
                                </Button>
                                <Label basic pointing='left'>
                                    {detailPost.likeCnt}
                                </Label>
                            </Button>
                        </>
                    )}
                </div>
                <Divider />
                <Reply postId={id} userId={userId} />
               </Container>
               {showChat && (
                    <Chat roomId={chatRoomId} chatRoomName={chatRoomName} setShowChat={setShowChat} />
                )}
        </div>
    );
}

export default DetailPost;
