import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import Cookies from 'js-cookie';
import React, {useEffect, useState} from 'react';
import {Nav, Navbar} from 'react-bootstrap';
import {Link, useNavigate} from "react-router-dom";
import {Button, Dropdown, Input} from 'semantic-ui-react';
import {useBlog} from '../contexts/blogContext';

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchType, setSearchType] = useState(localStorage.getItem('searchType') || '0'); // 로컬 스토리지에서 검색 타입을 가져옵니다.
    const [searchKeyword, setSearchKeyword] = useState(localStorage.getItem('searchKeyword') || '');
    const [showSearch, setShowSearch] = useState(false); // 검색 UI 표시 상태 추가
    const validToken = Cookies.get('Authorization');
    const navigate = useNavigate();
    const {blogName, setBlogName} = useBlog();
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        updateLoginStatus();
    }, [validToken]);

    useEffect(() => {
        localStorage.setItem('searchType', searchType); // 검색 타입을 로컬 스토리지에 저장합니다.
        localStorage.setItem('searchKeyword', searchKeyword); // 검색 키워드를 로컬 스토리지에 저장합니다.
    }, [searchType, searchKeyword]);

    const handleSearchTypeChange = (e, { value }) => {
        setSearchType(value); // 검색 유형 변경 핸들러
    };

    const updateLoginStatus = () => {
        // 토큰 유무에 따라 로그인 상태 업데이트
        if (validToken) {
            setIsLoggedIn(true);
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
            const username = claims.sub;
            const nickname = claims.nickname;

            setAvatar(process.env.PUBLIC_URL + '/images/' + nickname + '.jpg');
            setUsername(username);

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

    // 검색 요청 처리
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!showSearch) return; // showSearch가 false일 경우 함수를 종료
        if (searchKeyword === '') return; // 검색어가 비어있을 경우 함수를 종료
        navigate(`/search-post?type=${searchType}&keyword=${encodeURIComponent(searchKeyword)}`);
    };

    const toggleSearch = () => setShowSearch(!showSearch); // 검색 UI 표시 상태 토글

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="md">
                <Navbar.Brand >{blogName} blog</Navbar.Brand>
                <Navbar.Collapse id="collapsibleNavbar">
                    <Nav className="mr-auto" onClick={() => { setBlogName('') }}>
                        {isLoggedIn ? (
                            <>
                                <Nav.Link as={Link} to="/user">
                                    {avatar && <img src={avatar} alt="Avatar" style={{width: '30px', height: '30px', borderRadius: '50%'}}/>}
                                </Nav.Link>
                                {blogName !== '' ? (<Nav.Link as={Link} to="/" onClick={() => { setBlogName('') }}>블로그 홈</Nav.Link>)
                                    : (<Nav.Link as={Link} to={`/blog/${username}`}>내블로그</Nav.Link>)}
                                <Nav.Link as={Link} to="/write">글쓰기</Nav.Link>
                                <Nav.Link onClick={handleLogout}>로그아웃</Nav.Link>
                                <Nav.Link as={Link} to="/chat">채팅</Nav.Link>
                                <Nav.Link as={Link} to="/game-board">겜</Nav.Link>
                                <Nav.Link as={Link} to="/category-setting">카테고리</Nav.Link>
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
                    <Nav className="mr-auto">
                        {showSearch && (
                            <>
                                <Dropdown
                                    selection
                                    id="searchTypeDropdown"
                                    value={searchType}
                                    options={[
                                        { key: 'title', text: '제목', value: '0' },
                                        { key: 'contents', text: '내용', value: '1' },
                                        { key: 'titleAndContents', text: '제목+내용', value: '2' }
                                    ]}
                                    onChange={handleSearchTypeChange}
                                    style={{ minWidth: '105px', marginRight: '10px', borderRadius: '5px' }}
                                />
                                <Input
                                    className="prompt"
                                    type="text"
                                    id="searchKeyword"
                                    placeholder="검색어를 입력하세요"
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    style={{ width: '450px', paddingRight: '20px', textAlign: 'center' }}
                                />
                            </>
                        )}

                    </Nav>
                </Navbar.Collapse>
                <Button
                    icon="search"
                    type="button"
                    color="yellow"
                    id="searchButton"
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', marginRight: '10px' }}
                    onClick={(e) => {
                        toggleSearch(); // 검색 UI 표시 상태를 토글합니다.
                        handleSearchSubmit(e); // 검색을 수행합니다.
                    }}
                >
                </Button>
            </Navbar>
        </>
    )
}