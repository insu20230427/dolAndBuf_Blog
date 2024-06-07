import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import { Grid, GridColumn, GridRow, Icon, Segment } from 'semantic-ui-react';
import DOMPurify from 'dompurify';

const Index = () => {
    const [posts, setPosts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const navigate = useNavigate();
    const containerStyle = {
        height: '87vh',
        display: 'flex',
        justifyContent: 'center'
    };

    useEffect(() => {
        const fetchPosts = async (page) => {
            try {
                const response = await axios.get(`http://localhost:8080/api/posts?page=${page}`);
                console.log(response);
                setPosts(response.data.data.content); // API 응답의 데이터 필드를 posts 상태에 설정
                setTotalPages(response.data.data.totalPages);
                setCurrentPage(page);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts(currentPage); // 컴포넌트가 마운트되면 데이터를 가져옴
    }, [currentPage]);

    useEffect(() => {
        // 페이지 로드 시 로컬 스토리지에서 검색 관련 항목 삭제
        localStorage.removeItem('searchType');
        localStorage.removeItem('searchKeyword');
    }, []);

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber); // 페이지 변경 시 현재 페이지 업데이트
    };

    if (!posts) {
        return <div>Loading...</div>; // 데이터가 로딩 중일 때 표시할 내용
    }

    const getThumbnailAndText = (content) => {
        // DOMPurify를 사용하여 안전하게 HTML 파싱
        const cleanContent = DOMPurify.sanitize(content, {USE_PROFILES: {html: true}});
        const parser = new DOMParser();
        const doc = parser.parseFromString(cleanContent, 'text/html');
        
        // 첫 번째 이미지 태그 찾기
        const imgTag = doc.querySelector('img');
        const imgSrc = imgTag ? imgTag.src : null;
        
        // 이미지 태그를 제외한 텍스트 추출
        if (imgTag) {
            imgTag.remove();
        }
        const textContent = doc.body.textContent || "";

        return { imgSrc, textContent };
    };

    return (
        <div>
            <br /><br /><br /><br />
            <div className="container" style={containerStyle}>
                <div className="ui grid">
                    <Grid columns='equal'>
                        <GridRow columns={3}>
                            {posts.map(post => {
                                const { imgSrc, textContent } = getThumbnailAndText(post.content);
                                return (
                                    <GridColumn key={post.id}>
                                        <Segment
                                            className="card"
                                            onClick={() => {
                                                navigate(`/detail-post/${post.id}`, {});
                                            }}
                                            style={{ cursor: 'pointer', height: '250px' }}
                                        >
                                            <div className="content">
                                                <div className="header" style={{ textAlign: 'center', marginTop: '5px' }}>
                                                    {post.title}
                                                </div>
                                                {imgSrc && (
                                                    <div style={{ textAlign: 'center', marginTop: '5px' }}>
                                                        <img src={imgSrc} alt="thumbnail" style={{ maxHeight: '150px', maxWidth: '100px' }} />
                                                    </div>
                                                )}
                                                <div className="description" style={{ textAlign: 'center', marginTop: '5px' }}>
                                                    {textContent.length > 50 ? `${textContent.substring(0, 50)}...` : textContent}
                                                </div>
                                                <br />
                                                {post.modifyDate ? (
                                                    <div className="date" style={{ fontSize: 'small', textAlign: 'center' }}>
                                                        수정일 : {new Date(post.modifyDate).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: 'numeric',
                                                        minute: 'numeric'
                                                    })}
                                                    </div>
                                                ) : (
                                                    <div className="date" style={{ fontSize: 'small', textAlign: 'center' }}>
                                                        작성일 : {new Date(post.createDate).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: 'numeric',
                                                        minute: 'numeric'
                                                    })}
                                                    </div>
                                                )}
                                            </div>
                                        </Segment>
                                    </GridColumn>
                                );
                            })}
                        </GridRow>
                    </Grid>
                </div>
            </div>

            <nav className="mt-5">
                <Pagination className="justify-content-center">
                    <Pagination.Prev
                        onClick={() => handlePageClick(currentPage - 1)}
                        disabled={currentPage === 0}
                    >
                        <Icon color='grey' name="arrow left" />
                    </Pagination.Prev>

                    {Array.from({ length: totalPages }, (_, i) => (
                        <Pagination.Item
                            key={i}
                            active={i === currentPage}
                            onClick={() => handlePageClick(i)}
                        >
                            {i + 1}
                        </Pagination.Item>
                    ))}

                    <Pagination.Next
                        onClick={() => handlePageClick(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                    >
                        <Icon color='grey' name="arrow right" />
                    </Pagination.Next>
                </Pagination>
                <br />
                <br />
            </nav>
        </div>
    );
};

export default Index;
