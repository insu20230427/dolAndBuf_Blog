import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { Label } from "semantic-ui-react";
import Swal from 'sweetalert2';

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
                        {usernameError && <Label basic color='red' pointing>{usernameError}</Label>}
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
                        {passwordError && <Label basic color='red' pointing>{passwordError}</Label>}
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
                        {emailError && <Label basic color='red' pointing>{emailError}</Label>}
                    </Form.Group>
                </Form>
                <br />
                <Button variant="primary" onClick={handleSignup}>
                    회원가입
                </Button>
            </Container>

        </>
    );
};

export default Signup;

