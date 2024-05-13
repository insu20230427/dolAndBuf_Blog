import Header from "./header";
import {Button, Comment, Divider, Form, Icon, Label} from "semantic-ui-react";
import Footer from "./footer";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const DetailPost = () => {

    const containerStyle = {
        height: '87vh'
    }

    const [detailPost, setDetailPost] = useState({});
    const {id} = useParams();
    const navigate = useNavigate();
    const [replyContent, setReplyContent] = useState('');
    const [userId, setUserId] = useState('');
    const [editReplyId, setEditReplyId] = useState(null);
    const [replies, setReplies] = useState([]);
    const [replyUpdateContent, setReplyUpdateContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    console.log(detailPost);

    useEffect(() => {
        const storedToken = Cookies.get('Authorization');
        if (storedToken) {
            // "Bearer " 부분 제거 후 토큰만 추출
            const jwtToken = storedToken.split(' ')[1];

            // 토큰을 "."으로 분리하여 배열로 만듦
            const parts = jwtToken.split('.');

            // Payload 부분 추출 (인덱스 1)
            const payload = parts[1];

            // Base64 디코딩 후 JSON 파싱
            const decodedPayload = JSON.parse(atob(payload));

            console.log(decodedPayload)

            setUserId(decodedPayload.userId)
        }

        fetchPosts();
        fetchReplies();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/posts/${id}`);
            console.log(response.data.data)
            setDetailPost(response.data.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const fetchReplies = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/replys/${id}`);
            if (response.status === 200) {
                setReplies(response.data.data);
                console.log(response.data.data)
            }
        } catch (error) {
            console.error('댓글 가져오기 실패:', error);
        }
    };

    const handleDeletePost = async () => {
        try {
            axios.delete(`http://localhost:8080/api/posts/${id}`)
                .then(() => Swal.fire({
                    icon: 'success',
                    text: '게시글 삭제 성공.'
                }).then(() => {
                    navigate('/');
                }))
        } catch (error) {
            console.error('게시글 삭제 실패:', error);
            await Swal.fire({
                icon: 'error',
                text: '게시글 삭제 실패.'
            })
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
            fetchPosts();
        } catch (error) {
            console.error('좋아요 실패:', error);
            await Swal.fire({
                icon: 'warning',
                text: '좋아요 실패.'
            })
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
        } catch (error) {
            console.error('좋아요 삭제 실패:', error);
            await Swal.fire({
                icon: 'warning',
                text: '좋아요 삭제 실패.'
            })
        }
        fetchPosts();
    };

    const handleWriteReply = async () => {
        if (!userId) {
            await Swal.fire({
                text: '로그인 후 댓글을 작성할 수 있습니다.',
                icon: 'error'
            });
            return;
        }
        try {
            const response = await axios.post(`http://localhost:8080/api/replys/${id}`,
                {
                    userId: parseInt(userId, 10),
                    postId: parseInt(id, 10),
                    content: replyContent
                }, {
                    headers: {
                        'Authorization': Cookies.get('Authorization')
                    }
                });
            if (response.status === 200) {
                setReplyContent('');
                await Swal.fire({
                    text: '댓글 등록 성공.',
                    icon: 'success'
                })
                fetchReplies();
                fetchPosts();
            } else {
                throw new Error('댓글 등록에 실패했습니다.');
            }
        } catch (error) {
            console.error('댓글 등록 중 오류가 발생했습니다:', error);
            await Swal.fire({
                text: '댓글 등록에 실패했습니다. 다시 시도해주세요.',
                icon: 'error'
            });
        }
    };

    const handleUpdateReplyForm = (replyId) => {
        // 수정할 댓글 항목을 찾기
        const updatedReply = detailPost.replyList.find(reply => reply.id === replyId);

        // 댓글 수정 폼을 보여주고 해당 댓글의 내용을 replyContent state에 설정
        setReplyContent(updatedReply.content);

        // 수정 버튼과 수정 완료 버튼 보이도록 상태 변경
        setEditReplyId(replyId); // 이전에 수정한 댓글 ID 저장

        setIsEditing(true);

        fetchReplies();
    };

    const handleUpdateReply = async (replyId) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/replys/${id}/${replyId}`, {
                userId: userId,
                postId: id,
                content: replyUpdateContent
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': Cookies.get('Authorization')
                }
            });

            if (response.status === 200) {
                await Swal.fire({
                    text: '댓글이 수정되었습니다.',
                    icon: 'success'
                });
                // 댓글 수정 폼 닫기
                setEditReplyId(null);

                setIsEditing(false);

                fetchReplies();
            } else {
                throw new Error('댓글 수정에 실패했습니다.');
            }
        } catch (error) {
            console.error('댓글 수정 중 오류가 발생했습니다:', error);
            await Swal.fire({
                text: '댓글 수정에 실패했습니다. 다시 시도해주세요.',
                icon: 'error'
            });
        }
    };

    const handleDeleteReply = async (replyId) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/replys/${id}/${replyId}`, {
                headers: {
                    'Authorization': Cookies.get('Authorization')
                }
            });

            if (response.status === 200) {
                await Swal.fire({
                    text: '댓글이 삭제되었습니다.',
                    icon: 'success'
                });
                fetchReplies();
            } else {
                throw new Error('댓글 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('댓글 삭제 중 오류가 발생했습니다:', error);
            await Swal.fire({
                text: '댓글 삭제에 실패했습니다. 다시 시도해주세요.',
                icon: 'error'
            });
        }
    };

    return (
        <>
            <Header/>
            <div className="container" style={containerStyle}>
                <br/>
                <div className="ui large horizontal divided list">
                    <div className="item">
                        <div className="content">
                            <div className="header">글 번호: <span id="id">{id}</span></div>
                        </div>
                    </div>
                    <div className="item">
                        <div className="content">
                            {detailPost.user && (  // detailPost.user가 존재하는 경우에만 렌더링
                                <div className="header">작성자 : {detailPost.user.username}</div>
                            )}
                        </div>
                    </div>
                    <div className="ui labeled button" tabIndex="0">
                        {localStorage.getItem(`post_${id}_liked_${userId}`) === "true" ? (
                            <>
                                <Button as='div' labelPosition='right'>
                                    <Button icon color='red' onClick={deleteLikePost}>
                                        <Icon name='heart'/>
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
                                        <Icon name='heart'/>
                                    </Button>
                                    <Label basic pointing='left'>
                                        {detailPost.likeCnt}
                                    </Label>
                                </Button>
                            </>
                        )}
                    </div>
                    <Button icon onClick={() => {
                        navigate('/');
                    }}>
                        <Icon name="arrow left"/>
                    </Button>
                    {userId && detailPost.user && String(userId) === String(detailPost.user.id) && (
                       <>
                        <Button icon
                                onClick={() => {
                                    navigate(`/update-post/${id}`, {
                                    });
                                }}
                        >
                            <Icon name="cut"/>
                        </Button>
                        <Button icon onClick={handleDeletePost}>
                            <Icon name="trash alternate"/>
                        </Button>
                       </>
                    )}
                </div>
                <br/><br/>
                <h3>{detailPost.title}</h3>
                <Divider/>
                <div>
                    <div>{detailPost.content}</div>
                </div>
                <br/><br/><br/><br/><br/><br/>
                <h5>
                    댓글
                </h5>
                <Divider/>
                <Comment.Group>
                    {replies.map((reply) => (
                        <Comment key={reply.id}>
                            <Comment.Content>
                                <Comment.Author>{reply.user.username}</Comment.Author>
                                <Comment.Metadata>
                                    <div className="date">{reply.createDate}</div>
                                </Comment.Metadata>
                                {editReplyId === reply.id ? (
                                    // 수정 폼 표시
                                    <Form reply>
                                        <Form.TextArea
                                            value={replyUpdateContent}
                                            onChange={(e) => setReplyUpdateContent(e.target.value)}
                                        />
                                        <Button
                                            type={"button"}
                                            content="수정 완료"
                                            labelPosition="left"
                                            icon="edit"
                                            color="blue"
                                            className="btn-reply-write"
                                            onClick={() => handleUpdateReply(reply.id)}
                                        />
                                    </Form>
                                ) : (
                                    // 댓글 내용과 수정/삭제 버튼 표시
                                    <div>
                                        <Comment.Text>{reply.content}</Comment.Text>
                                        <Comment.Actions>
                                            {reply.user.id === userId && (
                                                <>
                                                    <a onClick={() => handleUpdateReplyForm(reply.id)}
                                                       className="reply">수정</a>
                                                    <a onClick={() => handleDeleteReply(reply.id)}
                                                       className="reply">삭제</a>
                                                </>
                                            )}
                                        </Comment.Actions>
                                    </div>
                                )}
                            </Comment.Content>
                        </Comment>
                    ))}
                </Comment.Group>

                {!isEditing && (
                    <Form reply>
                        <Form.TextArea
                            onChange={(e) => setReplyContent(e.target.value)}
                        />
                        <Button
                            type={"button"}
                            content="등록"
                            labelPosition="left"
                            icon="edit"
                            color="blue"
                            className="btn-reply-write"
                            onClick={handleWriteReply}
                        />
                    </Form>
                )}
            </div>
            <Footer/>
        </>
    );
}
export default DetailPost;
