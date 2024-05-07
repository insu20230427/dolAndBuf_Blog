import React, {useEffect} from 'react';
import {Navbar, Nav} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import Cookies from 'js-cookie';
import axios from 'axios';
import {Link, useNavigate} from "react-router-dom"

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const validToken = Cookies.get('Authorization');
    const navigate = useNavigate();

    useEffect(() => {
        updateLoginStatus();
    }, [validToken]);

    const updateLoginStatus = () => {
        // 토큰 유무에 따라 로그인 상태 업데이트
        if (validToken) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    };

    const handleLogout = async () => {
        if (!validToken) return;
        try {
            const response = await axios.post('http://localhost:8080/api/users/logout', null, {
                headers: {
                    'Authorization': validToken
                }
            });

            if (response.status === 200) {
                Cookies.remove('Authorization');
                setIsLoggedIn(false);
                navigate('/');
            }
        } catch (error) {
            console.error('Error logging out:', error);
            alert('로그아웃 중 오류가 발생했습니다.');
        }
    };

    return (
        <Navbar bg="dark" variant="dark" expand="md">
            <Navbar.Brand as={Link} to="/">돌앤벞 blog</Navbar.Brand>
            <Navbar.Toggle aria-controls="collapsibleNavbar"/>
            <Navbar.Collapse id="collapsibleNavbar">
                <Nav className="mr-auto">
                    {isLoggedIn ? (
                        <>
                            <Nav.Link as={Link} to="/write">글쓰기</Nav.Link>
                            <Nav.Link as={Link} to="/info">회원정보</Nav.Link>
                            <Nav.Link onClick={handleLogout}>로그아웃</Nav.Link>
                        </>
                    ) : (
                        <>
                            <Nav.Link as={Link} to="/login">로그인</Nav.Link>
                            <Nav.Link as={Link} to="/signup">회원가입</Nav.Link>
                        </>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}