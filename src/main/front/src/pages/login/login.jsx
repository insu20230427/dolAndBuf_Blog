import axios from 'axios';
import React, { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import FindIdModal from '../../components/FindIdModal';
import FindPasswordModal from '../../components/FindPasswordModal';
import './socialLoginButtons.css';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showFindIdModal, setShowFindIdModal] = useState(false);
    const [showFindPasswordModal, setShowFindPasswordModal] = useState(false);
    const navigate = useNavigate();

    const containerStyle = {
        height: '87vh'
    }

    const handleLogin = async () => {
        if (!username || !password) {
            await Swal.fire({
                icon: 'warning',
                text: '아이디 또는 비밀번호를 모두 입력해주세요.'
            });
            return;
        }

        try {
            await axios.post('http://localhost:8080/api/auth/login', {
                username: username,
                password: password
            }, {
                withCredentials: true
            });

            await Swal.fire({
                icon: 'success',
                text: '환영합니다. 로그인이 성공적으로 되었습니다!'
            }).then(() => {
                navigate('/');
            });
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                text: '로그인 요청이 실패했습니다. 다시 시도해주세요!'
            });
            console.error('로그인 실패:', error);
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
                    </Form.Group>
                    <br />
                    <Button variant="primary" onClick={handleLogin}>
                        로그인
                    </Button>
                </Form>
                <br />
                <div className="social-login-buttons">
                    <a href="https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=ee8abaaf81bcb4e83dff921f9a492de6&redirect_uri=http://localhost:8080/api/oauth2/kakao/callback">
                        <img src="/images/kakao_login_button.png" className="social-login-button" alt="Kakao Login" />
                    </a>
                    <a href="https://nid.naver.com/oauth2.0/authorize?&response_type=code&client_id=INlvRIKGwlO9MzaRzyrE&redirect_uri=http://localhost:8080/api/oauth2/naver/callback">
                        <img src="/images/naver_login_button.png" className="social-login-button" alt="Naver Login" />
                    </a>
                    <a href="http://localhost:8080/oauth2/authorization/google">
                        <div className="google-login-wrapper">
                            <img src="/images/google_login_button.png" className="social-login-button google-login-button" alt="Google Login" />
                        </div>
                    </a>
                </div>
                <br />
                <div className="sub-buttons">
                    <div><a href="/signup">아직 회원가입을 하지 않으셨나요?</a></div>
                    <div><button className="link-button" onClick={() => setShowFindIdModal(true)}>아이디 찾기</button></div>
                    <div><button className="link-button" onClick={() => setShowFindPasswordModal(true)}>비밀번호 찾기</button></div>
                </div>
            </Container>
            {showFindIdModal && <FindIdModal onClose={() => setShowFindIdModal(false)} />}
            {showFindPasswordModal && (
                <FindPasswordModal onClose={() => setShowFindPasswordModal(false)} />
            )}
        </>
    );
}

