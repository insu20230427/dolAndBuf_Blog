import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import ReactQuill from "react-quill";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Icon } from "semantic-ui-react";
import Swal from 'sweetalert2';
import Footer from "./footer";
import Header from "./header";

export default function UpdatePost() {
    const [detailPost, setDetailPost] = useState({});
    const navigate = useNavigate();
    const {id} = useParams();
    const [username, setUsername] = useState('');

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

            setUsername(decodedPayload.sub)
        }

        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/posts/${id}`);
                setDetailPost(response.data.data);
            } catch (error) {
                console.error('포스트 정보를 가져오는 도중 오류 발생:', error);
            }
        };

        fetchPost();

    }, []);

    // if (!title && !content && !id) {
    //     return alert("loading...");
    // }

    const containerStyle = {
        height: '87vh'
    }

    const setTitle = (e) => {
        setDetailPost({
            ...detailPost,
            title: e.target.value
        });
    }
    
    const setContent = (value) => {
        setDetailPost(({
            ...detailPost,
            content: value
        }));
    }

    const handleUpdate = async () => {
        try {
            axios.put(`http://localhost:8080/api/posts/${id}`, {
                title: detailPost.title,
                content: detailPost.content
            })
                .then(() => {
                    Swal.fire({
                        icon: 'success',
                        text: '게시글 수정 성공.'
                    }).then(() => {
                        navigate('/');
                    })
                })
        } catch (error) {
            console.error('게시글 수정 실패:', error);

            await Swal.fire({
                icon: 'error',
                text: '게시글 수정 실패. 다시 시도해주세요'
            });

            // 상세 페이지로 리다이렉션
            navigate(`/detail-post/${id}`);
        }
    };


    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/posts/${id}`);
            Swal.fire({
                icon: 'success',
                text: '게시글 삭제 성공.'
            }).then(() => {
                navigate('/');
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: '게시글 삭제 실패. 다시 시도해주세요'
            }).then(() => {
                navigate(`/detail-post/${id}`);
            });
        }
    };

    return (
        <>
            <Header/>
            <br/>
            <br/>
            <div className="container" style={containerStyle}>
                <Form>
                    <Form.Group>
                        <Form.Control
                            type="text"
                            value={detailPost.title}
                            onChange={(e) => {
                                setDetailPost({
                                    ...detailPost,
                                    title: e.target.value
                                })}}
                        />
                    </Form.Group>
                    <br/>
                    <Form.Group>
                        <ReactQuill
                            theme="snow"
                            value={detailPost.content}
                            onChange={setContent}
                            style={{height: '700px'}}
                        />
                    </Form.Group>
                    <br/><br/><br/><br/><br/>
                    <div style={{textAlign: 'center'}}>
                        <Button icon onClick={() => navigate('/')}>
                            <Icon name="arrow left"/>
                        </Button>
                        {detailPost.user && detailPost.user.username === username && (
                            <>
                                <Button type="button" onClick={handleUpdate}>
                                    수정
                                </Button>
                                <Button type="button" onClick={handleDelete}>
                                    삭제
                                </Button>
                            </>
                        )}
                    </div>
                </Form>
            </div>
            <Footer/>
        </>
    );
};