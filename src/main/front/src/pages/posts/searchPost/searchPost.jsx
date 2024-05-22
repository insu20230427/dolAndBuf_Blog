import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Pagination } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import { Grid, GridColumn, GridRow, Icon, Segment } from 'semantic-ui-react';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function SearchPost() {
        const query = useQuery();
        const searchType = query.get('type');
        const searchKeyword = query.get('keyword');

        const [posts, setPosts] = useState([]);
        const [totalPages, setTotalPages] = useState();
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
                    const response = await axios.get(`http://localhost:8080/api/posts/search?type=${searchType}&keyword=${encodeURIComponent(searchKeyword)}`);
                    setPosts(response.data.data.content); // API 응답의 데이터 필드를 posts 상태에 설정
                    setTotalPages(response.data.data.totalPages)
                    setCurrentPage(page);
                } catch (error) {
                    console.error('Error fetching posts:', error);
                }
            };           

            fetchPosts(currentPage); // 컴포넌트가 마운트되면 데이터를 가져옴

            if (searchKeyword) {
                fetchPosts();
            }

        }, [currentPage, searchType, searchKeyword]);

        const handlePageClick = (pageNumber) => {
            setCurrentPage(pageNumber); // 페이지 변경 시 현재 페이지 업데이트
        };

        if (!posts) {
            return <div>Loading...</div>; // 데이터가 로딩 중일 때 표시할 내용
        }

        return (
            <div>

                <br/><br/>
                {/* <h1>검색 결과</h1>
                <p>검색 타입: {searchType === '0' ? '제목' : searchType === '1' ? '제목or내용' : '내용'}</p>
                <p>검색 키워드: {searchKeyword}</p> */}
                <br/><br/>
                <div className="container" style={containerStyle}>
                    <div className="ui grid">
                        <Grid columns='equal'>
                            <GridRow columns={3}>
                                {posts.length > 0 ? (
                                    posts.map(post => (
                                    <GridColumn key={post.id}>
                                        <Segment
                                            className="card"
                                            onClick={() => {
                                                navigate(`/detail-post/${post.id}`, {
                                                });
                                            }}
                                            style={{cursor: 'pointer', height: '250px'}}
                                        >
                                            <div className="content">
                                                <div className="header" style={{textAlign: 'center', marginTop: '5px'}}>
                                                    {post.title}
                                                </div>
                                                <div className="description"
                                                     style={{textAlign: 'center', marginTop: '5px'}}>
                                                    {post.content.length > 50 ? `${post.content.substring(0, 50)}...` : post.content}
                                                </div>
                                                <br/>
                                                <div className="extra content"
                                                     style={{fontSize: 'x-small', textAlign: 'center'}}>
                                                    {post.modifyDate ? `수정일 : ${post.modifyDate}` : `작성일 : ${post.createDate}`}
                                                </div>
                                            </div>
                                        </Segment>
                                    </GridColumn>
                                    ))
                                    ) : (
                                        <p>검색 결과가 없습니다.</p>
                                    )}
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
                    <br/>
                    <br/>
                </nav>

            </div>
        );
    }
;
