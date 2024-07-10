import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Input, Dropdown, Pagination, Icon, Container, Modal, Form, TextArea } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import styles from './manageReplys.module.css';

const ManageReplys = () => {
    const [replys, setReplys] = useState([]);
    const [selectedReplys, setSelectedReplys] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentReply, setCurrentReply] = useState({});
    const [replyContent, setReplyContent] = useState('');
    const navigate = useNavigate();
    const validToken = Cookies.get('Authorization');
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [userId, setUserId] = useState('');

    const fetchReplys = async (page) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/admin/replys?page=${page}`, {
                headers: {
                    Authorization: validToken,
                },
            });
            setReplys(response.data.data.content);
            setTotalPages(response.data.data.totalPages);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error fetching replies:', error);
        }
    };

    useEffect(() => {

        const jwtToken = validToken.split(' ')[1];
        const parts = jwtToken.split('.');
        const payload = parts[1];
        const decodedPayload = JSON.parse(atob(payload));

        setUserId(decodedPayload.userId);

        fetchReplys(currentPage);
    }, [validToken, currentPage]);

    const handleReply = (reply) => {
        setCurrentReply(reply);
        setIsModalOpen(true);
    };

    const handelBanUser = () => {
        // 차단 로직 추가
    }

    const handleDelete = async (replyId) => {
        try {
            await axios.delete(`http://localhost:8080/api/admin/replys/${replyId}`, {
                headers: {
                    'Authorization': validToken
                }
            });
            Swal.fire({
                icon: 'success',
                text: '댓글 삭제 성공.'
            }).then(() => {
                setReplys(replys.filter(reply => reply.id !== replyId));
            });
        } catch (error) {
            console.error('댓글 삭제 실패:', error);
            await Swal.fire({
                icon: 'error',
                text: '댓글 삭제 실패.'
            });
        }
    };

    const handleBulkChange = async (action) => {
        try {
            if (action === 'delete') {
                await Promise.all(selectedReplys.map(replyId => axios.delete(`http://localhost:8080/api/admin/replys/${replyId}`, {
                    headers: {
                        'Authorization': validToken
                    }
                })));
                Swal.fire({
                    icon: 'success',
                    text: '선택된 댓글 삭제 성공.'
                }).then(() => {
                    setReplys(replys.filter(reply => !selectedReplys.includes(reply.id)));
                    setSelectedReplys([]);
                    setSelectAll(false);
                });
            } else {
                // 공개/비공개 처리 로직 추가
                // 예시: axios.patch 또는 axios.put을 사용하여 상태 변경 요청 보내기
            }
        } catch (error) {
            console.error('선택된 댓글 처리 실패:', error);
            await Swal.fire({
                icon: 'error',
                text: '선택된 댓글 처리 실패.'
            });
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedReplys(replys.map(reply => reply.id));
        } else {
            setSelectedReplys([]);
        }
        setSelectAll(e.target.checked);
    };

    const handleSelectReply = (replyId) => {
        const updatedSelectedReplys = selectedReplys.includes(replyId)
            ? selectedReplys.filter(id => id !== replyId)
            : [...selectedReplys, replyId];

        setSelectedReplys(updatedSelectedReplys);
        setSelectAll(updatedSelectedReplys.length === replys.length);
    };

    const handlePageChange = (e, { activePage }) => {
        setCurrentPage(activePage - 1);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setReplyContent('');
    };

    const handleReplySubmit = async () => {
        try {
            const postId = currentReply.post.id;
            const parentReplyId = currentReply.id;

            const response = await axios.post(`http://localhost:8080/api/comments/${postId}/${parentReplyId}`, {
                userId: parseInt(userId, 10),
                content: replyContent
            }, {
                headers: {
                    'Authorization': validToken
                }
            });
            Swal.fire({
                icon: 'success',
                text: '답글 작성 성공.'
            }).then(() => {
                handleModalClose();
                setCurrentReply(null);
                fetchReplys(currentPage);
            });
        } catch (error) {
            console.error('답글 작성 실패:', error);
            await Swal.fire({
                icon: 'error',
                text: '답글 작성 실패.'
            });
        }
    };

    return (
        <div className={styles.container}>
            <h2>댓글 관리</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <td>
                            <div className={styles.statusChangeContainer}>
                                <Input type="checkbox" id="selectAll" className={styles.checkbox} onChange={handleSelectAll} checked={selectAll} />
                                <label htmlFor="selectAll" className={styles.checkboxLabel}>{selectAll ? '모두 선택됨' : '선택 됨'}</label>
                                <Dropdown
                                    text='변경'
                                    icon='caret down'
                                    floating
                                    labeled
                                    button
                                    className='icon'
                                    disabled={selectedReplys.length === 0}
                                >
                                    <Dropdown.Menu>
                                        <Dropdown.Item text='공개' onClick={() => handleBulkChange('public')} />
                                        <Dropdown.Item text='비공개' onClick={() => handleBulkChange('private')} />
                                        <Dropdown.Item text='삭제' onClick={() => handleBulkChange('delete')} />
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {replys && replys.length > 0 ? (
                        replys.map((reply) => (
                            <tr key={reply.id} className={styles.replyItem}>
                                <td className={styles.checkboxTd}>
                                    <Input
                                        type="checkbox"
                                        checked={selectedReplys.includes(reply.id)}
                                        onChange={() => handleSelectReply(reply.id)}
                                    />
                                </td>
                                <td className={styles.replyContent}>
                                    <span className={styles.replysInfo}><a href={`/detail-post/${reply.post.id}`}>{reply.post.title}</a></span>
                                    <span className={styles.replysInfoSeparator}>ㆍ</span>
                                    <span className={styles.replysInfo}>{reply.user.nickname}({reply.user.username})</span>
                                    <span className={styles.replysInfoSeparator}>ㆍ</span>
                                    <span className={styles.replysInfo}>{new Date(reply.createDate).toLocaleString()}</span>
                                    <br />
                                    {reply.content}
                                </td>
                                <td className={styles.replyActions}>
                                    <Button className={styles.button} onClick={() => handleReply(reply)}>답글</Button>
                                    {reply.user.id === userId ?
                                        (<Button className={styles.button} onClick={() => handelBanUser(reply.id)} disabled>차단</Button>)
                                        : (<Button className={styles.button} onClick={() => handelBanUser(reply.id)}>차단</Button>)}

                                    <Button className={styles.button} onClick={() => handleDelete(reply.id)}>삭제</Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3}>아직 등록된 댓글이 없습니다</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <Container textAlign="center" style={{ padding: '20px', paddingBottom: '100px', margin: 'auto' }}>
                <Pagination
                    defaultActivePage={currentPage + 1}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    ellipsisItem={{ content: <Icon name="ellipsis horizontal" />, icon: true }}
                    firstItem={{ content: <Icon name="angle double left" />, icon: true }}
                    lastItem={{ content: <Icon name="angle double right" />, icon: true }}
                    prevItem={{ content: <Icon name="angle left" />, icon: true }}
                    nextItem={{ content: <Icon name="angle right" />, icon: true }}
                />
            </Container>
            <Modal
                open={isModalOpen}
                onClose={handleModalClose}
                size='small'
            >
                <Modal.Header>답글 달기</Modal.Header>
                <Modal.Content>
                    <Form>
                        <TextArea
                            placeholder='답글 내용을 입력하세요.'
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                        />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={handleModalClose}>취소</Button>
                    <Button onClick={handleReplySubmit} primary>답글 달기</Button>
                </Modal.Actions>
            </Modal>
        </div>
    );
};

export default ManageReplys;
