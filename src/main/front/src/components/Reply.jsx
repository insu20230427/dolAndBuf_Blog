import axios from "axios";
import Cookies from "js-cookie";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Button, Comment, Form, Icon, Label} from "semantic-ui-react";
import Swal from "sweetalert2";
import './Reply.css'

const Reply = ({postId, userId}) => {
    const [replies, setReplies] = useState([]);
    const [replyContent, setReplyContent] = useState('');
    const [editReplyId, setEditReplyId] = useState(null);
    const [replyUpdateContent, setReplyUpdateContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [subReplies, setSubReplies] = useState({});
    const [subReplyContent, setSubReplyContent] = useState('');
    const [subReplyEditId, setSubReplyEditId] = useState(null);
    const [subReplyUpdateContent, setSubReplyUpdateContent] = useState('');
    const [showSubReplyFormId, setShowSubReplyFormId] = useState(null);
    const [showSubRepliesId, setShowSubRepliesId] = useState(null);
    const [avatar, setAvatar] = useState('');


    useEffect(() => {
        fetchReplies();

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

        setAvatar(process.env.PUBLIC_URL + '/images/' + username + '.jpg');
        console.log(avatar)
    }, []);

    const fetchReplies = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/replys/${postId}`);
            if (response.status === 200) {
                const repliesData = response.data.data;
                setReplies(repliesData);

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
            const response = await axios.get(`http://localhost:8080/api/comments/${postId}/${replyId}`);
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

    const handleWriteReply = async () => {
        if (!userId) {
            await Swal.fire({
                text: '로그인 후 댓글을 작성할 수 있습니다.',
                icon: 'error'
            });
            return;
        }
        try {
            const response = await axios.post(`http://localhost:8080/api/replys/${postId}`, {
                userId: parseInt(userId, 10),
                postId: parseInt(postId, 10),
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
            const response = await axios.put(`http://localhost:8080/api/replys/${postId}/${replyId}`, {
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
            const response = await axios.delete(`http://localhost:8080/api/replys/${postId}/${replyId}`, {
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
            const response = await axios.post(`http://localhost:8080/api/comments/${postId}/${parentReplyId}`, {
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
        setSubReplyEditId(subReplyId);
        const subReplyToEdit = subReplies[replyId]?.find(subReply => subReply.id === subReplyId);

        if (subReplyToEdit) {
            setSubReplyUpdateContent(subReplyToEdit.content);
        } else {
            console.error('대댓글을 찾을 수 없습니다.');
        }
    };

    const handleUpdateSubReply = async (subReplyId) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/comments/${postId}/${editReplyId}/${subReplyId}`, {
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
            const response = await axios.delete(`http://localhost:8080/api/comments/${postId}/${editReplyId}/${subReplyId}`, {
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
            });
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
            await fetchReplies();
        } catch (error) {
            console.error('좋아요 삭제 실패:', error);
            await Swal.fire({
                icon: 'warning',
                text: '좋아요 삭제 실패.'
            });
        }
    };

    return (
        <Comment.Group>
            {replies.map((reply) => (
                <Comment key={reply.id}>
                    <Comment.Content >
                        <Comment.Author>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                                <Link to={`/blog/${reply.user.username}`}>
                                    <img src={process.env.PUBLIC_URL + '/images/' + reply.user.nickname + '.jpg'}
                                         alt="Avatar" style={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        marginRight: '5px'
                                    }}/>{reply.user.nickname}
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
                                        setShowSubReplyFormId(showSubReplyFormId === reply.id ? null : reply.id);
                                        setSubReplies(prevState => ({
                                            ...prevState,
                                            [reply.id]: !prevState[reply.id]
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
                                {showSubRepliesId === reply.id && (
                                    (subReplies[reply.id] && Array.isArray(subReplies[reply.id])) ?
                                        subReplies[reply.id].map((subReply, index) => (
                                            <Comment.Group key={subReply.id}>
                                                <Comment>
                                                    <Comment.Content>
                                                        <Comment.Author>
                                                            <Link to={`/blog/${subReply.user.username}`}>
                                                                <img
                                                                    src={process.env.PUBLIC_URL + '/images/' + subReply.user.nickname + '.jpg'}
                                                                    alt="Avatar" style={{
                                                                    width: '20px',
                                                                    height: '20px',
                                                                    borderRadius: '50%',
                                                                    marginRight: '5px'
                                                                }}/>{subReply.user.nickname}
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
        </Comment.Group>
    );
};

export default Reply;
