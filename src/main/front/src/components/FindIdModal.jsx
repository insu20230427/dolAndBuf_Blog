import axios from 'axios';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import './FindIdModal.css';
import { Button, Form, Modal, Icon, Message } from 'semantic-ui-react';

export default function FindIdModal({ onClose }) {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [codeVerified, setCodeVerified] = useState(false);

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
        <Modal open onClose={onClose} size="small" className="custom-modal">
            <Modal.Header>
                <Icon name="user circle" /> 아이디 찾기
            </Modal.Header>
            <Modal.Content>
                <Form style={{height : '300px'}}>
                    <Form.Field>
                        <label>이메일</label>
                        <Form.Input
                            type="email"
                            placeholder="인증번호를 보낼 이메일을 입력해주세요."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={emailSent}
                            action={
                                <Button onClick={handleSendCode} disabled={emailSent} color="blue">
                                    인증번호 전송
                                </Button>
                            }
                        />
                    </Form.Field>
                    {emailSent && (
                        <Form.Field>
                            <label>인증번호</label>
                            <Form.Input
                                type="text"
                                placeholder="인증번호 8자리 입력"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                disabled={codeVerified}
                                action={
                                    <Button onClick={handleVerifyCode} disabled={codeVerified} color="blue">
                                        인증번호 확인
                                    </Button>
                                }
                            />
                        </Form.Field>
                    )}
                    {codeVerified && (
                        <Message info>
                            <Message.Header>인증 완료</Message.Header>
                            <p>
                                인증 완료 시,{' '}
                                <span onClick={handleSendUsername} style={{ color: 'blue', cursor: 'pointer' }}>
                                    링크
                                </span>
                                를 클릭하면 귀하의 이메일로 아이디가 발송됩니다.
                            </p>
                        </Message>
                    )}
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={onClose} color="grey">
                    돌아가기
                </Button>
            </Modal.Actions>
        </Modal>
    );
}