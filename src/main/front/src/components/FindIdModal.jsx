import axios from 'axios';
import React, { useState } from 'react';
import { Button, Container, Form, Modal } from 'react-bootstrap'; // Modal 컴포넌트 추가
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

export default function FindIdModal({ onClose }) { // onClose 함수 추가
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [codeVerified, setCodeVerified] = useState(false);
    const navigate = useNavigate();

    const handleSendCode = async () => {
        try {
            await axios.post('http://localhost:8080/api/auth/send-mail/code', null, {
                params: { email }
            });
            Swal.fire({
                icon: 'success',
                text: '인증코드가 전송됐습니다. 인증코드를 확인하신 후, 인증해주세요.'
            });
            setEmailSent(true);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: '인증코드를 전송 실패했습니다. 다시 시도해주세요.'
            });
            console.error('인증코드 전송 실패:', error);
        }
    };

    const handleVerifyCode = async () => {
        try {
            await axios.post('http://localhost:8080/api/auth/send-mail/code/verify', null, {
                params: { code }
            });
            Swal.fire({
                icon: 'success',
                text: '인증이 완료되었습니다. 아이디를 찾으실려면 아래 링크를 클릭해주세요.'
            });
            setCodeVerified(true);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: '인증이 실패했습니다. 다시 시도해주세요.'
            });
            console.error('인증 실패:', error);
        }
    };

    const handleSendUsername = async () => {
        try {
            await axios.post('http://localhost:8080/api/auth/send-mail/username', null, {
                params: { email }
            });
            Swal.fire({
                icon: 'success',
                text: '아이디가 이메일로 전송되었습니다.'
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: '아이디 전송 실패했습니다. 다시 시도해주세요.'
            });
            console.error('아이디 전송 실패:', error);
        }
    };

    return (
        <Modal show onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>아이디 찾기</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>이메일</Form.Label>
                        <div className="input-group mb-3">
                            <Form.Control
                                type="email"
                                placeholder="인증번호를 보낼 이메일을 입력해주세요."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={emailSent}
                            />
                            <Button onClick={handleSendCode} disabled={emailSent}>인증번호 전송</Button>
                        </div>
                        <span id="span-code"></span>
                    </Form.Group>
                    {emailSent && (
                        <Form.Group>
                            <Form.Label>인증번호</Form.Label>
                            <div className="input-group mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="인증번호 8자리 입력"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    disabled={codeVerified}
                                />
                                <Button onClick={handleVerifyCode} disabled={codeVerified}>인증번호 확인</Button>
                            </div>
                            <span id="span-verify"></span>
                        </Form.Group>
                    )}
                    {codeVerified && (
                        <span
                            id="send-username"
                            onClick={handleSendUsername}
                            style={{ color: 'cornflowerblue', cursor: 'pointer' }}
                        >
                            인증 완료 시, 링크를 클릭하면 귀하의 이메일로 아이디가 발송됩니다.
                        </span>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    돌아가기
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
