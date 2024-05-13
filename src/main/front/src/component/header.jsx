import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { Button, Form, FormControl, Nav, Navbar } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchType, setSearchType] = useState(localStorage.getItem('searchType') || '0'); // 로컬 스토리지에서 검색 타입을 가져옵니다.
    const [searchKeyword, setSearchKeyword] = useState(localStorage.getItem('searchKeyword') || '');
    const validToken = Cookies.get('Authorization');
    const navigate = useNavigate();

    useEffect(() => {
        updateLoginStatus();
    }, [validToken]);

    useEffect(() => {
        localStorage.setItem('searchType', searchType); // 검색 타입을 로컬 스토리지에 저장합니다.
        localStorage.setItem('searchKeyword', searchKeyword); // 검색 키워드를 로컬 스토리지에 저장합니다.
    }, [searchType, searchKeyword]);

    const updateLoginStatus = () => {
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

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/searchPost?type=${searchType}&keyword=${encodeURIComponent(searchKeyword)}`);
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
                            <Nav.Link as={Link} to="/user">회원정보</Nav.Link>
                            <Nav.Link onClick={handleLogout}>로그아웃</Nav.Link>
                        </>
                    ) : (
                        <>
                            <Nav.Link as={Link} to="/login">로그인</Nav.Link>
                            <Nav.Link as={Link} to="/signup">회원가입</Nav.Link>
                        </>
                    )}
                </Nav>
                <Form inline className="ml-auto" onSubmit={handleSearch}>
                    <FormControl as="select" value={searchType} onChange={e => setSearchType(e.target.value)} className="mr-sm-2">
                        <option value="0">제목</option>
                        <option value="1">제목+내용</option>
                        <option value="2">내용</option>
                    </FormControl>
                    <FormControl type="text" placeholder="검색" className="mr-sm-2" value={searchKeyword} onChange={e => setSearchKeyword(e.target.value)} />
                    <Button type="submit" variant="outline-success">검색</Button>
                </Form>
            </Navbar.Collapse>
        </Navbar>
    );
}
