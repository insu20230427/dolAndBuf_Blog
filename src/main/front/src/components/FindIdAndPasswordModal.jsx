import axios from 'axios';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import './FindIdAndPasswordModal.css';
import { Button, Icon, Loader } from 'semantic-ui-react';

export default function FindIdAndPasswordModal({ onClose }) {
    const [isRightPanelActive, setIsRightPanelActive] = useState(false);
    const [emailForId, setEmailForId] = useState('');
    const [codeForId, setCodeForId] = useState('');
    const [emailForPassword, setEmailForPassword] = useState('');
    const [codeForPassword, setCodeForPassword] = useState('');
    const [emailSentForId, setEmailSentForId] = useState(false);
    const [emailSentForPassword, setEmailSentForPassword] = useState(false);
    const [codeVerifiedForId, setCodeVerifiedForId] = useState(false);
    const [codeVerifiedForPassword, setCodeVerifiedForPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSendCodeForId = async (email) => {
        setLoading(true);
        try {
            await axios.post('http://localhost:8080/api/auth/send-mail/code', null, {
                params: { email }
            });
            Swal.fire({
                icon: 'success',
                text: '인증코드가 전송됐습니다. 인증코드를 확인하신 후, 인증해주세요.'
            });
            setEmailSentForId(true);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: '인증코드를 전송 실패했습니다. 다시 시도해주세요.'
            });
            console.error('인증코드 전송 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCodeForId = async (code) => {
        setLoading(true);
        try {
            await axios.post('http://localhost:8080/api/auth/send-mail/code/verify', null, {
                params: { code }
            });
            Swal.fire({
                icon: 'success',
                text: '인증이 완료되었습니다. 아이디를 찾으실려면 아래 링크를 클릭해주세요.'
            });
            setCodeVerifiedForId(true);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: '인증이 실패했습니다. 다시 시도해주세요.'
            });
            console.error('인증 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendCodeForPassword = async (email) => {
        setLoading(true);
        try {
            await axios.post('http://localhost:8080/api/auth/send-mail/code', null, {
                params: { email }
            });
            Swal.fire({
                icon: 'success',
                text: '인증코드가 전송됐습니다. 인증코드를 확인하신 후, 인증해주세요.'
            });
            setEmailSentForPassword(true);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: '인증코드를 전송 실패했습니다. 다시 시도해주세요.'
            });
            console.error('인증코드 전송 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCodeForPassword = async (code) => {
        setLoading(true);
        try {
            await axios.post('http://localhost:8080/api/auth/send-mail/code/verify', null, {
                params: { code }
            });
            Swal.fire({
                icon: 'success',
                text: '인증이 완료되었습니다. 비밀번호를 재설정하려면 아래 링크를 클릭해주세요.'
            });
            setCodeVerifiedForPassword(true);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: '인증이 실패했습니다. 다시 시도해주세요.'
            });
            console.error('인증 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendUsername = async (email) => {
        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    const handleSendTempPassword = async (email) => {
        setLoading(true);
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
        } finally {
            setLoading(false);
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
                                value={emailForId}
                                onChange={(e) => setEmailForId(e.target.value)}
                                disabled={emailSentForId}
                            />
                            <Button icon
                                circular
                                onClick={() => handleSendCodeForId(emailForId)}
                                disabled={emailSentForId || loading}
                                color='black'
                                style={{
                                    marginLeft: '10px',
                                }}>
                                <Icon name='send' />
                            </Button>
                        </div>
                        {loading && <Loader active inline='centered' />}
                        {emailSentForId && (
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="8자리 인증코드를 입력해주세요."
                                    value={codeForId}
                                    onChange={(e) => setCodeForId(e.target.value)}
                                    disabled={codeVerifiedForId}
                                />
                                <Button icon
                                    circular
                                    onClick={() => handleVerifyCodeForId(codeForId)}
                                    disabled={codeVerifiedForId || loading}
                                    color='black'
                                    style={{
                                        marginLeft: '10px',
                                    }}>
                                    <Icon name='check' />
                                </Button>
                            </div>
                        )}
                        {codeVerifiedForId && (
                            <div className="message info">
                                <p>
                                    인증이 완료되면, {' '}
                                    <span onClick={() => handleSendUsername(emailForId)} className="link">
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
                                value={emailForPassword}
                                onChange={(e) => setEmailForPassword(e.target.value)}
                                disabled={emailSentForPassword}
                            />
                            <Button icon
                                circular
                                onClick={() => handleSendCodeForPassword(emailForPassword)}
                                disabled={emailSentForPassword || loading}
                                color='black'
                                style={{
                                    marginLeft: '10px',
                                }}>
                                <Icon name='send' />
                            </Button>
                        </div>
                        {loading && <Loader active inline='centered' />}
                        {emailSentForPassword && (
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="8자리 인증코드를 입력해주세요."
                                    value={codeForPassword}
                                    onChange={(e) => setCodeForPassword(e.target.value)}
                                    disabled={codeVerifiedForPassword}
                                />
                                <Button icon
                                    circular
                                    onClick={() => handleVerifyCodeForPassword(codeForPassword)}
                                    disabled={codeVerifiedForPassword || loading}
                                    color='black'
                                    style={{
                                        marginLeft: '10px',
                                    }}>
                                    <Icon name='check' />
                                </Button>
                            </div>
                        )}
                        {codeVerifiedForPassword && (
                            <div className="message info">
                                <p>
                                    인증이 완료되면, {' '}
                                    <span onClick={() => handleSendTempPassword(emailForPassword)} className="link">
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
