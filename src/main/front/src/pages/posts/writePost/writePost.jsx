import axios from 'axios';
import Cookies from "js-cookie";
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill 에디터 스타일
import { useNavigate } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';
import Swal from "sweetalert2"; // Quill 에디터

const WritePost = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const containerStyle = {
        height: '87vh'
    }

    const handlePostSubmit = async (e) => {
        e.preventDefault();

        try {

            const response = await axios.post('http://localhost:8080/api/posts', {
                title: title,
                content: content
            }, {
                headers: {
                    'Authorization': Cookies.get('Authorization'),
                }
            });

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    text: '게시글 작성 성공.'
                }).then(() => {
                    navigate('/');
                })
            }
        } catch (error) {
            console.error('게시글 작성 실패:', error);
            await Swal.fire({
                icon: 'error',
                text: '게시글 작성 실패.'
            })
        }
    };

    return (
        <>

            <br/>
            <br/>
            <div className="container" style={containerStyle}>
                <Form onSubmit={handlePostSubmit}>
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
                            onChange={setContent} // ReactQuill가 알아서 setContent에 content를 넣어줌
                            placeholder="Write your content here..."
                            style={{height: '700px'}}
                        />
                    </Form.Group>
                    <br/><br/><br/><br/><br/>
                    <div style={{textAlign: 'center'}}>
                        <Button icon onClick={() => navigate('/')}>
                            <Icon name="arrow left"/>
                        </Button>
                        <Button icon type="submit">
                            <Icon name="edit"/>
                        </Button>
                    </div>
                </Form>
            </div>
            
        </>
    );
};

export default WritePost;