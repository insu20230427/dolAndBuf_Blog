import React, {useEffect, useState} from 'react';
import {Navbar, Nav} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Input, Dropdown} from 'semantic-ui-react'
import Cookies from 'js-cookie';
import axios from 'axios';
import {Link, useNavigate} from "react-router-dom"

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const validToken = Cookies.get('Authorization');
    const navigate = useNavigate();

    const [searchType, setSearchType] = useState('title'); // 검색 유형 상태
    const [searchKeyword, setSearchKeyword] = useState(''); // 검색어 상태

    const handleSearchTypeChange = (e, { value }) => {
        setSearchType(value); // 검색 유형 변경 핸들러
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // 검색 실행 로직을 이곳에 추가할 수 있습니다.
        console.log('Search Type:', searchType);
        console.log('Search Keyword:', searchKeyword);
    };

    const searchOptions = [ // 검색 유형 옵션 배열
        { key: 'title', text: '제목', value: 'title' },
        { key: 'contents', text: '내용', value: 'contents' },
        { key: 'titleAndContents', text: '제목+내용', value: 'titleAndContents' },
    ];

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
        <>
            <Navbar bg="dark" variant="dark" expand="md">
                <Navbar.Brand as={Link} to="/">돌앤벞 blog</Navbar.Brand>
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
                </Navbar.Collapse>
                <Navbar.Collapse id="collapsibleNavbar">
                <form className="search-form" style={{display: 'flex', justifyContent: 'center'}}
                      onSubmit={handleSearchSubmit}>
                    <Dropdown
                        selection
                        id="searchTypeDropdown"
                        value={searchType}
                        options={searchOptions}
                        onChange={handleSearchTypeChange}
                        style={{minWidth: '105px', marginRight: '10px', borderRadius: '5px'}}
                    />
                    <Input
                        className="prompt"
                        type="text"
                        id="searchKeyword"
                        placeholder="검색어를 입력하세요"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        style={{width: '450px', paddingRight: '20px', textAlign: 'center'}}
                    />
                    <Button
                        icon="search"
                        type="button"
                        color="yellow"
                        id="searchButton"
                        style={{border: 'none', background: 'transparent', cursor: 'pointer'}}
                    >
                    </Button>
                </form>
                </Navbar.Collapse>
            </Navbar>
        </>
    )
}