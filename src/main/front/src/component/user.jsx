import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from "./footer";
import Header from "./header";
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";
import {FormField, Label} from "semantic-ui-react";

const User = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [id, setId] = useState('');
    const [password, setPassword] = useState('')
    const [oauth, setOauth] = useState('')
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');

    useEffect(() => {
        const storedToken = Cookies.get('Authorization');
        if (storedToken) {
            // "Bearer " 부분 제거 후 토큰만 추출
            const jwtToken = storedToken.split(' ')[1];

            // 토큰을 "."으로 분리하여 배열로 만듦
            const parts = jwtToken.split('.');

            // Payload 부분 추출 (인덱스 1)
            const payload = parts[1];

            // Base64 디코딩 후 JSON 파싱
            const decodedPayload = JSON.parse(atob(payload));

            console.log(decodedPayload)

            setEmail(decodedPayload.email);
            setUsername(decodedPayload.sub);
            setId(decodedPayload.userId);
            setOauth(decodedPayload.oauth);
        }
    }, []);

    const containerStyle = {
        height: '87vh'
    }

    const updateUser = async () => {

        console.log(email)
        console.log(username)
        console.log(id)
        console.log(password)
        console.log(oauth)
        console.log(Cookies.get('Authorization'))

        try {
            await axios.put(
                'http://localhost:8080/api/users',
                {
                    username: username,
                    email: email,
                    password: password
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
            <Header/>
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
            <Footer/>
        </>
    );
};

export default User;
