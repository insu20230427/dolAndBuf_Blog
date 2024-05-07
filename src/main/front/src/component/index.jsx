import React, {useState, useEffect} from 'react';
import Header from './header';
import Footer from './footer';
import {Pagination} from 'react-bootstrap';
import 'semantic-ui-css/semantic.min.css';
import {GridRow, GridColumn, Grid, Segment, Icon} from 'semantic-ui-react'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import {useNavigate} from 'react-router-dom';


const Index = () => {
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
                    const response = await axios.get(`http://localhost:8080/api/posts?page=${page}`);
                    console.log(response);
                    setPosts(response.data.data.content); // API 응답의 데이터 필드를 posts 상태에 설정
                    setTotalPages(response.data.data.totalPages)
                    setCurrentPage(page);
                } catch (error) {
                    console.error('Error fetching posts:', error);
                }
            };

            fetchPosts(currentPage); // 컴포넌트가 마운트되면 데이터를 가져옴
        }, [currentPage]);

        const handlePageClick = (pageNumber) => {
            setCurrentPage(pageNumber); // 페이지 변경 시 현재 페이지 업데이트
        };

        if (!posts) {
            return <div>Loading...</div>; // 데이터가 로딩 중일 때 표시할 내용
        }

        return (
            <div>
                <Header/>
                <br/><br/><br/><br/>
                <div className="container" style={containerStyle}>
                    <div className="ui grid">
                        <Grid columns='equal'>
                            <GridRow columns={3}>
                                {posts.map(post => (
                                    <GridColumn key={post.id}>
                                        <Segment
                                            className="card"
                                            onClick={() => {
                                                navigate(`/detail-post/${post.id}`, {
                                                    state: { detailPost: post }
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
                                ))}
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
                <Footer/>
            </div>
        );
    }
;

export default Index;