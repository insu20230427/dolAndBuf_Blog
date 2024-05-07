import React, {useState} from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Header from "./header";
import Footer from "./footer";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Form, Button} from 'react-bootstrap';
import {useNavigate} from "react-router-dom";

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const navigate = useNavigate()

    const containerStyle = {
        height: '87vh'
    }

    const handleSignup = async () => {

        try {
            await axios.post('http://localhost:8080/api/auth/signup', {
                username: username,
                password: password,
                email: email
            });

            Swal.fire({
                icon: 'success',
                text: '회원가입이 성공적으로 완료되었습니다!'
            }).then(() => {
                navigate('/');
            });
        } catch (error) {
            if (error.response) {
                const errors = error.response.data.errors;
                if (errors) {
                    setUsernameError(errors.username || '');
                    setPasswordError(errors.password || '');
                    setEmailError(errors.email || '');
                }
            }

            Swal.fire({
                icon: 'error',
                text: '회원가입 실패: 회원가입이 실패하였습니다. 다시 시도해주세요'
            });
            console.error('회원가입 실패:', error);
        }
    };

    return (
        <>
            <Header />
            <br />
            <Container style={containerStyle}>
                <Form>
                    <Form.Group controlId="username">
                        <Form.Label>아이디</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="아이디를 입력해주세요."
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        {usernameError && <span style={{ color: 'red', fontSize: 'small' }}>{usernameError}</span>}
                    </Form.Group>
                    <br />
                    <Form.Group controlId="password">
                        <Form.Label>비밀번호</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="비밀번호를 입력해주세요."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {passwordError && <span style={{ color: 'red', fontSize: 'small' }}>{passwordError}</span>}
                    </Form.Group>
                    <br />
                    <Form.Group controlId="email">
                        <Form.Label>이메일</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="이메일을 입력해주세요."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {emailError && <span style={{ color: 'red', fontSize: 'small' }}>{emailError}</span>}
                    </Form.Group>
                </Form>
                <br />
                <Button variant="primary" onClick={handleSignup}>
                    회원가입
                </Button>
            </Container>
            <Footer />
        </>
    );
};

export default Signup;

