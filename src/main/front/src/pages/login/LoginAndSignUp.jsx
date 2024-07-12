import React, { useState } from 'react';
import './LoginAndSignUp.css'; // 적절한 CSS 파일을 import
import FindIdAndPasswordModal from '../../components/FindIdAndPasswordModal';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const LoginAndSignUp = () => {
    const [isRightPanelActive, setIsRightPanelActive] = useState(false);
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [nicknameError, setNicknameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showFindModal, setShowFindModal] = useState(false);
    const navigate = useNavigate();

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
            .map(part => part[0].toUpperCase())
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

        context.fillStyle = avatarData.color;
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.font = '40px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = 'white';
        context.fillText(avatarData.name, canvas.width / 2, canvas.height / 2);

        return canvas.toDataURL('image/jpeg');
    };


    return (
        <div className="login-signup-wrapper">
            <div className={`login-signup-container ${isRightPanelActive ? 'right-panel-active' : ''}`} id="loginSignupContainer">
                <div className="form-container sign-up-container">
                    <form action="#">
                        <h1>계정 생성</h1>
                        <br />
                        <input type="text" placeholder="닉네임" value={nickname} onChange={(e) => setNickname(e.target.value)} />
                        {nicknameError && <span className="login-signup-error">{nicknameError}</span>}
                        <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
                        {emailError && <span className="login-signup-error">{emailError}</span>}
                        <input type="text" placeholder="아이디" value={username} onChange={(e) => setUsername(e.target.value)} />
                        {usernameError && <span className="login-signup-error">{usernameError}</span>}
                        <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
                        {passwordError && <span className="login-signup-error">{passwordError}</span>}
                        <br /><br />
                        <button type="button" onClick={handleSignup}>회원가입</button>
                    </form>
                </div>
                <div className="form-container sign-in-container">
                    <form action="#">
                        <h1>로그인</h1>
                        <input type="text" placeholder="아이디" value={username} onChange={(e) => setUsername(e.target.value)} />
                        <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <Link as={Link} to="/find" onClick={() => setShowFindModal(true)} style={{ margin: '30px 0 0 0' }}>아이디/비밀번호를 잊으셨나요?</Link>
                        <button type="button" onClick={handleLogin}>로그인</button>
                        <div className="login-signup-separator">
                            <p>OR</p>
                        </div>
                        <div className="login-signup-social-buttons">
                            <a href="https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=ee8abaaf81bcb4e83dff921f9a492de6&redirect_uri=http://localhost:8080/api/oauth2/kakao/callback">
                                <img src="/images/kakao_login_button.png" className="login-signup-social-button" alt="카카오 로그인" />
                            </a>
                            <a href="https://nid.naver.com/oauth2.0/authorize?&response_type=code&client_id=INlvRIKGwlO9MzaRzyrE&redirect_uri=http://localhost:8080/api/oauth2/naver/callback">
                                <img src="/images/naver_login_button.png" className="login-signup-social-button" alt="네이버 로그인" />
                            </a>
                            <a href="http://localhost:8080/oauth2/authorization/google">
                                <div className="login-signup-google-login-wrapper">
                                    <img src="/images/google_login_button.png" className="login-signup-social-button login-signup-google-login-button" alt="구글 로그인" />
                                </div>
                            </a>
                        </div>
                    </form>
                </div>
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>안농</h1>
                            <p>로그인 해조.</p>
                            <button className="ghost" onClick={() => setIsRightPanelActive(false)} id="signIn">로그인</button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>처음보넹 ㅎㅇ</h1>
                            <p>회원가입 ㄱ</p>
                            <button className="ghost" onClick={() => setIsRightPanelActive(true)} id="signUp">회원가입</button>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {showFindModal && <FindIdAndPasswordModal onClose={() => setShowFindModal(false)} />}
                </div>
            </div>
        </div>
    );
};

export default LoginAndSignUp;