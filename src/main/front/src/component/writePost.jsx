import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {Form} from 'react-bootstrap';
import {Button, Icon} from 'semantic-ui-react';
import 'react-quill/dist/quill.snow.css'; // Quill 에디터 스타일
import ReactQuill from 'react-quill';
import Cookies from "js-cookie";
import Header from "./header";
import Footer from "./footer"; // Quill 에디터

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
                alert('게시글이 작성되었습니다!');
                navigate('/');
            }
        } catch (error) {
            console.error('게시글 작성 실패:', error);
            alert('게시글 작성을 실패했습니다. 다시 작성해주세요!');
        }
    };

    return (
        <>
            <Header/>
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
            <Footer/>
        </>
    );
};

export default WritePost;