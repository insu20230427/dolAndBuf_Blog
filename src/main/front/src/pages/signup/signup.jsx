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
    const [nickname, setNickname] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [nicknameError, setNicknameError] = useState('');
    const navigate = useNavigate();

    const containerStyle = {
        height: '87vh'
    };

    const stringToColor = (string) => {
        let hash = 0;
        for (let i = 0; i < string.length; i++) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';
        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        return color;
    };

    const stringAvatar = (name) => {
        const initials = name
            .split(' ')
            .map(part => part[0].toUpperCase()) // 각 부분의 첫 글자를 대문자로 변환
            .join('');
        return {
            name: initials,
            color: stringToColor(name)
        };
    };

    const drawAvatar = (name) => {
        const avatarData = stringAvatar(name);
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const context = canvas.getContext('2d');

        // Draw background
        context.fillStyle = avatarData.color;
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Draw initials
        context.font = '40px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = 'white';
        context.fillText(avatarData.name, canvas.width / 2, canvas.height / 2);

        return canvas.toDataURL('image/jpeg');
    };

    const handleSignup = async () => {
        try {
            const avatarImage = drawAvatar(nickname);

            await axios.post('http://localhost:8080/api/auth/signup', {
                username: username,
                password: password,
                email: email,
                nickname: nickname,
                avatarImage: avatarImage
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
                    setNicknameError(errors.nickname || '');
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
                    <br/>
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
                    <br/>
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
                <br/>
                <Form.Group controlId="nickname">
                    <Form.Label>닉네임</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="닉네임을 입력해주세요."
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                    {nicknameError && <Label basic color='red' pointing>{nicknameError}</Label>}
                </Form.Group>
                <br/>
                <Button variant="primary" onClick={handleSignup}>
                    회원가입
                </Button>
            </Container>
        </>
    );
};

export default Signup;