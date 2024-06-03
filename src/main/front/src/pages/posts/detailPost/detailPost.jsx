import axios from "axios";
import Cookies from "js-cookie";
import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Button, Comment, Divider, Form, Icon, Label} from "semantic-ui-react";
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
    const [subReplies, setSubReplies] = useState({});
    const [subReplyContent, setSubReplyContent] = useState('');
    const [subReplyEditId, setSubReplyEditId] = useState(null);
    const [subReplyUpdateContent, setSubReplyUpdateContent] = useState('');
    const [showSubReplyFormId, setShowSubReplyFormId] = useState(null);
    const [showSubRepliesId, setShowSubRepliesId] = useState(null);

    useEffect(() => {
        const storedToken = Cookies.get('Authorization');
        if (storedToken) {
            const jwtToken = storedToken.split(' ')[1];
            const parts = jwtToken.split('.');
            const payload = parts[1];
            const decodedPayload = JSON.parse(atob(payload));
            setUserId(decodedPayload.userId);
        }

        fetchPosts();
        fetchReplies();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/posts/${id}`);
            setDetailPost(response.data.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const fetchReplies = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/replys/${id}`);
            if (response.status === 200) {
                const repliesData = response.data.data;
                setReplies(repliesData);

                // Fetch subReplies for each reply
                const subRepliesPromises = repliesData.map(async (reply) => {
                    const subRepliesResponse = await fetchSubReplies(reply.id);
                    return {[reply.id]: subRepliesResponse};
                });

                const subRepliesData = await Promise.all(subRepliesPromises);
                const combinedSubReplies = Object.assign({}, ...subRepliesData);
                setSubReplies(combinedSubReplies);
            }
        } catch (error) {
            console.error('댓글 가져오기 실패:', error);
        }
    };

    const fetchSubReplies = async (replyId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/comments/${id}/${replyId}`);
            if (response.status === 200) {
                return response.data.data;
            } else {
                throw new Error('대댓글 가져오기에 실패했습니다.');
            }
        } catch (error) {
            console.error(`대댓글 가져오기 실패: ${error}`);
            return [];
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
                });
                await fetchReplies();
                await fetchPosts();
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
        const updatedReply = replies.find(reply => reply.id === replyId);
        setReplyContent(updatedReply.content);
        setEditReplyId(replyId);
        setIsEditing(true);
    };

    const handleUpdateReply = async (replyId) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/replys/${id}/${replyId}`, {
                userId: userId,
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
                setEditReplyId(null);
                setIsEditing(false);
                await fetchReplies();
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
                await fetchReplies();
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

    const handleWriteSubReply = async (parentReplyId) => {
        if (!userId) {
            await Swal.fire({
                text: '로그인 후 대댓글을 작성할 수 있습니다.',
                icon: 'error'
            });
            return;
        }
        try {
            const response = await axios.post(`http://localhost:8080/api/comments/${id}/${parentReplyId}`,
                {
                    userId: parseInt(userId, 10),
                    content: subReplyContent
                }, {
                    headers: {
                        'Authorization': Cookies.get('Authorization')
                    }
                });
            if (response.status === 200) {
                setSubReplyContent('');
                await Swal.fire({
                    text: '대댓글 등록 성공.',
                    icon: 'success'
                });
                await fetchReplies();
            } else {
                throw new Error('대댓글 등록에 실패했습니다.');
            }
        } catch (error) {
            console.error('대댓글 등록 중 오류가 발생했습니다:', error);
            await Swal.fire({
                text: '대댓글 등록에 실패했습니다. 다시 시도해주세요.',
                icon: 'error'
            });
        }
    };

    const handleShowSubReplies = (replyId) => {
        setShowSubRepliesId(replyId === showSubRepliesId ? null : replyId);
    };

    const handleUpdateSubReplyForm = (subReplyId, replyId) => {
        // 현재 수정 중인 대댓글 ID 설정
        setSubReplyEditId(subReplyId);

        // 해당 replyId의 대댓글 목록에서 subReplyId에 맞는 대댓글을 찾음
        const subReplyToEdit = subReplies[replyId]?.find(subReply => subReply.id === subReplyId);

        if (subReplyToEdit) {
            setSubReplyUpdateContent(subReplyToEdit.content);
        } else {
            console.error('대댓글을 찾을 수 없습니다.');
        }
    };
    const handleUpdateSubReply = async (subReplyId) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/comments/${id}/${editReplyId}/${subReplyId}`, {
                userId: userId,
                content: subReplyUpdateContent
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': Cookies.get('Authorization')
                }
            });

            if (response.status === 200) {
                await Swal.fire({
                    text: '대댓글이 수정되었습니다.',
                    icon: 'success'
                });
                setSubReplyEditId(null);
                await fetchReplies();
            } else {
                throw new Error('대댓글 수정에 실패했습니다.');
            }
        } catch (error) {
            console.error('대댓글 수정 중 오류가 발생했습니다:', error);
            await Swal.fire({
                text: '대댓글 수정에 실패했습니다. 다시 시도해주세요.',
                icon: 'error'
            });
        }
    };

    const handleDeleteSubReply = async (subReplyId) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/comments/${id}/${editReplyId}/${subReplyId}`, {
                headers: {
                    'Authorization': Cookies.get('Authorization')
                }
            });

            if (response.status === 200) {
                await Swal.fire({
                    text: '대댓글이 삭제되었습니다.',
                    icon: 'success'
                });
                await fetchReplies();
            } else {
                throw new Error('대댓글 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('대댓글 삭제 중 오류가 발생했습니다:', error);
            await Swal.fire({
                text: '대댓글 삭제에 실패했습니다. 다시 시도해주세요.',
                icon: 'error'
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
            await fetchPosts();
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
            console.error('댓글 좋아요 삭제 실패:', error);
            await Swal.fire({
                icon: 'warning',
                text: '댓글 좋아요 삭제 실패.'
            })
        }
        await fetchPosts();
    };

    const addLikeReply = async (replyId) => {
        try {
            const response = await axios.post(`http://localhost:8080/api/replys/likes/${replyId}`, {}, {
                headers: {
                    'Authorization': Cookies.get('Authorization')
                }
            });
            const userId = response.data.data;
            localStorage.setItem(`reply_${replyId}_liked_${userId}`, 'true');
            await fetchReplies();
        } catch (error) {
            console.error('댓글 좋아요 실패:', error);
            await Swal.fire({
                icon: 'warning',
                text: '댓글 좋아요 실패.'
            })
        }
    };

    const deleteLikeReply = async (replyId) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/replys/likes/${replyId}`, {
                headers: {
                    'Authorization': Cookies.get('Authorization')
                }
            });
            const userId = response.data.data;
            localStorage.setItem(`reply_${replyId}_liked_${userId}`, 'false');
        } catch (error) {
            console.error('좋아요 삭제 실패:', error);
            await Swal.fire({
                icon: 'warning',
                text: '좋아요 삭제 실패.'
            })
        }
        await fetchReplies();
    };


    return (
        <>
            <div className="ui container" style={containerStyle}>
                <br/><br/><h2>게시글 상세보기</h2>
                <div>
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
                                        navigate(`/update-post/${id}`);
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
                                <Comment.Author>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}>
                                        <Link to={`/blog/${reply.user.username}`}>
                                            {reply.user.username}
                                        </Link>
                                        <Comment.Actions>
                                            {reply.user.id === userId && (
                                                <>
                                                    <a onClick={() => handleUpdateReplyForm(reply.id)}
                                                       className="reply">수정</a>
                                                    <a onClick={() => handleDeleteReply(reply.id)}
                                                       className="reply">삭제</a>
                                                </>
                                            )}
                                            <a onClick={() => {
                                                setShowSubReplyFormId(showSubReplyFormId === reply.id ? null : reply.id); // 대댓글 폼 열기/닫기
                                                setSubReplies(prevState => ({
                                                    ...prevState,
                                                    [reply.id]: !prevState[reply.id] // 대댓글 상태 업데이트
                                                }));
                                            }}>대댓글 작성</a>
                                            <a onClick={() => handleShowSubReplies(reply.id)}>대댓글 보기</a>
                                            <div className="ui labeled button" tabIndex="0">
                                                {localStorage.getItem(`reply_${reply.id}_liked_${userId}`) === "true" ? (
                                                    <>
                                                        <Button as='div' labelPosition='right'>
                                                            <Button icon color='red'
                                                                    onClick={() => deleteLikeReply(reply.id)}>
                                                                <Icon name='heart'/>
                                                            </Button>
                                                            <Label basic color='red' pointing='left'>
                                                                {reply.likeCnt}
                                                            </Label>
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Button as='div' labelPosition='right'>
                                                            <Button icon onClick={() => addLikeReply(reply.id)}>
                                                                <Icon name='heart'/>
                                                            </Button>
                                                            <Label basic pointing='left'>
                                                                {reply.likeCnt}
                                                            </Label>
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </Comment.Actions>
                                    </div>
                                </Comment.Author>
                                <Comment.Metadata>
                                    <div
                                        className="date">{new Date(reply.createDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: 'numeric'
                                    })}</div>
                                </Comment.Metadata>
                                {editReplyId === reply.id ? (
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
                                    <div>
                                        <Comment.Text>{reply.content}</Comment.Text>
                                        {showSubRepliesId === reply.id && ( // 대댓글 보기가 클릭된 댓글에 대해서만 렌더링합니다.
                                            (subReplies[reply.id] && Array.isArray(subReplies[reply.id])) ?
                                                subReplies[reply.id].map((subReply, index) => (
                                                    <Comment.Group key={subReply.id}>
                                                        <Comment>
                                                            <Comment.Content>
                                                                <Comment.Author>
                                                                    <Link to={`/blog/${subReply.user.username}`}>
                                                                        {subReply.user.username}
                                                                    </Link>
                                                                </Comment.Author>
                                                                <Comment.Metadata>
                                                                    <div
                                                                        className="date">{new Date(subReply.createDate).toLocaleDateString('en-US', {
                                                                        year: 'numeric',
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        hour: 'numeric',
                                                                        minute: 'numeric'
                                                                    })}</div>
                                                                </Comment.Metadata>
                                                                {subReplyEditId === subReply.id ? (
                                                                    <Form reply>
                                                                        <Form.TextArea
                                                                            value={subReplyUpdateContent}
                                                                            onChange={(e) => setSubReplyUpdateContent(e.target.value)}
                                                                        />
                                                                        <Button
                                                                            type={"button"}
                                                                            content="수정 완료"
                                                                            labelPosition="left"
                                                                            icon="edit"
                                                                            color="blue"
                                                                            className="btn-reply-write"
                                                                            onClick={() => handleUpdateSubReply(subReply.id, reply.id)}
                                                                        />
                                                                    </Form>
                                                                ) : (
                                                                    <>
                                                                        <Comment.Text>{subReply.content}</Comment.Text>
                                                                        <Comment.Actions>
                                                                            {subReply.user.id === userId && (
                                                                                <>
                                                                                    <a onClick={() => handleUpdateSubReplyForm(subReply.id, reply.id)}
                                                                                       className="reply">수정</a>
                                                                                    <a onClick={() => handleDeleteSubReply(subReply.id, reply.id)}
                                                                                       className="reply">삭제</a>
                                                                                </>
                                                                            )}
                                                                        </Comment.Actions>
                                                                    </>
                                                                )}
                                                            </Comment.Content>
                                                        </Comment>
                                                    </Comment.Group>
                                                ))
                                                : null
                                        )}
                                        {showSubReplyFormId === reply.id && (
                                            <Form reply>
                                                <Form.TextArea
                                                    value={subReplyContent}
                                                    onChange={(e) => setSubReplyContent(e.target.value)}
                                                />
                                                <Button
                                                    type={"button"}
                                                    content="대댓글 등록"
                                                    labelPosition="left"
                                                    icon="edit"
                                                    color="blue"
                                                    className="btn-reply-write"
                                                    onClick={() => handleWriteSubReply(reply.id)}
                                                />
                                            </Form>
                                        )}
                                    </div>
                                )}
                            </Comment.Content>
                        </Comment>
                    ))}
                </Comment.Group>

                {!isEditing && (
                    <Form reply>
                        <Form.TextArea
                            value={replyContent}
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
        </>
    );
}
export default DetailPost;