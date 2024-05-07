import React, {useState} from "react";
import axios from "axios";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import Header from "./header";
import {Form} from "react-bootstrap";
import ReactQuill from "react-quill";
import {Button, Icon} from "semantic-ui-react";
import Footer from "./footer";
import Swal from 'sweetalert2';

export default function DetailPost() {
    const location = useLocation();
    const {detailPost} = location.state || {};
    const navigate = useNavigate();
    const [title, setTitle] = useState(detailPost?.title || '');
    const [content, setContent] = useState(detailPost?.content || '');
    const {id} = useParams();

    if (!title && !content && !id) {
        return alert("loading..."); // 상태가 없을 때 로딩 처리 또는 에러 처리
    }

    const containerStyle = {
        height: '87vh'
    }

    const handleUpdate = async () => {
        try {
            axios.put(`http://localhost:8080/api/posts/${id}`, {
                title: title,
                content: content
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
                            placeholder="Enter title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Form.Group>
                    <br/>
                    <Form.Group>
                        <ReactQuill
                            theme="snow"
                            value={content}
                            onChange={setContent}
                            placeholder="Write your content here..."
                            style={{height: '700px'}}
                        />
                    </Form.Group>
                    <br/><br/><br/><br/><br/>
                    <div style={{textAlign: 'center'}}>
                        <Button icon onClick={() => navigate('/')}>
                            <Icon name="arrow left"/>
                        </Button>
                        <button className="btn btn-primary" onClick={handleUpdate}>
                            수정
                        </button>
                        <button className="btn btn-danger ml-2" onClick={handleDelete}>
                            삭제
                        </button>
                    </div>
                </Form>
            </div>
            <Footer/>
        </>
    );
};