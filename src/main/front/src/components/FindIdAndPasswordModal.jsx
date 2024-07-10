import axios from 'axios';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import './FindIdAndPasswordModal.css';
import { Button, Icon } from 'semantic-ui-react';

export default function FindIdAndPasswordModal({ onClose }) {
    const [isRightPanelActive, setIsRightPanelActive] = useState(false);
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

    const handleSendTempPassword = async () => {
        try {
            await axios.post('http://localhost:8080/api/auth/send-mail/password', null, {
                params: { email }
            });
            Swal.fire({
                icon: 'success',
                text: '임시 비밀번호가 이메일로 전송되었습니다.'
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: '임시 비밀번호 전송 실패했습니다. 다시 시도해주세요.'
            });
            console.error('임시 비밀번호 전송 실패:', error);
        }
    };

    return (
        <div className="find-wrapper">
            <div className={`find-container ${isRightPanelActive ? 'right-panel-active' : ''}`} id="findContainer">
                <div className="form-container find-id-container">
                    <form action="#">
                        <h1>아이디 찾기</h1>
                        <br />
                        <div className="form-group">
                            <input
                                type="email"
                                placeholder="인증코드를 받을 이메일을 입력해주세요."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={emailSent}
                            />
                            <Button icon
                                onClick={handleSendCode}
                                disabled={emailSent}
                                style={{
                                    marginLeft: '10px',
                                    height: '44.98px'
                                }}>
                                <Icon name='send' />
                            </Button>
                        </div>
                        {emailSent && (
                            <div className="form-group">
                                <label>인증코드</label>
                                <input
                                    type="text"
                                    placeholder="8자리 인증코드를 입력해주세요."
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    disabled={codeVerified}
                                />
                                <button onClick={handleVerifyCode} disabled={codeVerified} className="btn btn-primary">
                                    인증코드 확인
                                </button>
                            </div>
                        )}
                        {codeVerified && (
                            <div className="message info">
                                <strong>인증 완료</strong>
                                <p>
                                    인증이 완료되면, {' '}
                                    <span onClick={handleSendUsername} className="link">
                                        여기
                                    </span>
                                    를 클릭하여 아이디를 이메일로 받으세요.
                                </p>
                            </div>
                        )}
                    </form>
                </div>
                <div className="form-container find-password-container">
                    <form action="#">
                        <h1>비밀번호 재설정</h1>
                        <br />
                        <div className="form-group">
                            <input
                                type="email"
                                placeholder="인증코드를 받을 이메일을 입력해주세요."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={emailSent}
                            />
                                <Button icon
                                onClick={handleSendCode}
                                disabled={emailSent}
                                style={{
                                    marginLeft: '10px',
                                    height: '44.98px'
                                }}>
                                <Icon name='send' />
                            </Button>
                        </div>
                        {emailSent && (
                            <div className="form-group">
                                <label>인증코드</label>
                                <input
                                    type="text"
                                    placeholder="8자리 인증코드를 입력해주세요."
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    disabled={codeVerified}
                                />
                                <button onClick={handleVerifyCode} disabled={codeVerified} className="btn btn-success">
                                    인증코드 확인
                                </button>
                            </div>
                        )}
                        {codeVerified && (
                            <div className="message info">
                                <strong>인증 완료</strong>
                                <p>
                                    인증이 완료되면, {' '}
                                    <span onClick={handleSendTempPassword} className="link">
                                        여기
                                    </span>
                                    를 클릭하여 임시 비밀번호를 이메일로 받으세요.
                                </p>
                            </div>
                        )}
                    </form>
                </div>
                <div className="overlay-container">
                    <div className="find-overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>아이디 찾기</h1>
                            <p>이메일을 입력하여 아이디를 찾으세요.</p>
                            <button className="ghost" onClick={() => setIsRightPanelActive(false)} id="findId">
                                아이디 찾기
                            </button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>비밀번호 재설정</h1>
                            <p>이메일을 입력하여 비밀번호를 재설정하세요.</p>
                            <button className="ghost" onClick={() => setIsRightPanelActive(true)} id="findPassword">
                                비밀번호 찾기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
