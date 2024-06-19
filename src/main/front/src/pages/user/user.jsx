import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FormField, Label } from "semantic-ui-react";
import { default as Swal, default as swal } from 'sweetalert2';

const User = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [id, setId] = useState('');
    const [password, setPassword] = useState('')
    const [oauth, setOauth] = useState('');
    const [nickname, setNickname] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [nicknameError, setNicknameError] = useState('');

    useEffect(() => {
        const validToken = Cookies.get('Authorization');
        const jwtParts = validToken.split(' ');
        if (jwtParts.length !== 2) {
            console.error('Invalid JWT Token format');
            return;
        }

        const token = jwtParts[1];
        const parts = token.split('.');
        if (parts.length !== 3) {
            console.error('Invalid JWT Token structure');
            return;
        }

        const payload = parts[1];
        // Base64 URL 디코딩
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const binaryString = atob(base64);
        const bytes = Uint8Array.from(binaryString, c => c.charCodeAt(0));
        const jsonPayload = new TextDecoder().decode(bytes);

        const claims = JSON.parse(jsonPayload);

            setEmail(claims.email);
            setUsername(claims.sub);
            setId(claims.userId);
            setNickname(claims.nickname);
            setOauth(claims.oauth);
    }, []);

    const containerStyle = {
        height: '87vh'
    }

    const updateUser = async () => {

        try {
            await axios.put(
                'http://localhost:8080/api/users',
                {
                    username: username,
                    email: email,
                    password: password,
                    nickname: nickname
                },
                {
                    withCredentials: true,
                    headers: {
                        Authorization: Cookies.get('Authorization')
                    }
                }
            );

            // 회원 수정 성공 시 SweetAlert 띄우고 페이지 리다이렉션
            swal.fire({
                text: '회원 수정이 완료 되었습니다.!',
                icon: 'success'
            })
                .then(() => {
                    setTimeout(() => {
                        navigate('/');
                    }, 50);
                });
        } catch (error) {
            console.error('유저 정보 업데이트 실패:', error);

            if (error.response) {
                const errors = error.response.data.errors;
                if (errors) {
                    setEmailError(errors.email || '');
                    setPasswordError(errors.password || '');
                    setNicknameError(errors.nickname || '');
                }
            }

            // 실패 시 에러 메시지 출력
            await Swal.fire({
                icon: 'error',
                text: '유저 정보 업데이트 실패. 다시 시도해주세요'
            });

            // 상세 페이지로 리다이렉션
            navigate(`/user`);
        }
    };

    return (
        <>

            <br/>
            <br/>
            <div className="container" style={containerStyle}>
                <input type="hidden" id="id" value={id}/>
                {/*<div className="form-group">*/}
                {/*    <label>아이디</label>*/}
                {/*    <input type="text" value={username} className="form-control" id="username" readOnly/>*/}
                {/*</div>*/}
                <FormField>
                    <label>아이디</label>
                    <input type="text" value={username} className="form-control" id="username" readOnly/>
                </FormField>
                <br/>
                {!oauth ? (
                    <div id="oauth2-false">
                        <FormField>
                            <label>비밀번호</label>
                            <input type="password"
                                   className="form-control"
                                   id="update-password"
                                   placeholder="비밀번호를 입력하세요"
                                   value={password}
                                   onChange={(e) => setPassword(e.target.value)}/>
                            {passwordError && <Label basic color='red' pointing>{passwordError}</Label>}

                            {/*<span style={{color: 'cornflowerblue', fontSize: 'small'}}>비밀번호는 영문, 숫자, 특수문자의 조합으로 8~16자리여야 합니다.</span>*/}
                        </FormField>
                        <br/>
                        <FormField>
                            <label>이메일</label>
                            <input type="email"
                                   className="form-control"
                                   id="update-email"
                                   placeholder="이메일을 입력하세요"
                                   value={email}
                                   onChange={(e) => setEmail(e.target.value)}/>
                            {emailError && <Label basic color='red' pointing>{emailError}</Label>}
                            <span></span>
                            <br/>
                        </FormField>
                        <FormField>
                            <label>닉네임</label>
                            <input type="nickname"
                                   className="form-control"
                                   id="update-nickname"
                                   placeholder="닉네임을 입력하세요"
                                   value={nickname}
                                   onChange={(e) => setNickname(e.target.value)}/>
                            {nicknameError && <Label basic color='red' pointing>{nicknameError}</Label>}
                            <span></span>
                        </FormField>
                        <br/>
                        <button type="button" onClick={updateUser} className="btn btn-primary">회원수정</button>
                    </div>
                ) : (
                    <div id="oauth2-true">
                        <FormField>
                            <label>이메일</label>
                            <input type="email" id="btn-oauth2-email" className="form-control" placeholder="이메일을 입력하세요"
                                   value={email} readOnly/>
                        </FormField>
                    </div>
                )}
            </div>

        </>
    );
};

export default User;
