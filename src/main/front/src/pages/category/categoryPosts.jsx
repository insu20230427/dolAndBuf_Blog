import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Pagination } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import { Grid, GridColumn, GridRow, Icon, Segment } from 'semantic-ui-react';
import DOMPurify from 'dompurify';

const CategoryPosts = () => {
    const [posts, setPosts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const navigate = useNavigate();
    const { categoryId } = useParams();

    const containerStyle = {
        height: '87vh',
        display: 'flex',
        justifyContent: 'center'
    };

    useEffect(() => {
        const fetchPosts = async (page) => {
            try {
                const url = categoryId === 'all' || '' ?
                    `http://localhost:8080/api/posts?page=${page}` :
                    `http://localhost:8080/api/${categoryId}/posts?page=${page}`;
                const response = await axios.get(url);
                const responseData = response.data.data;
                setPosts(responseData.content);
                setTotalPages(responseData.totalPages);
                setCurrentPage(page);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts(currentPage);
    }, [currentPage, categoryId]);

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const getThumbnailAndText = (content) => {
        const cleanContent = DOMPurify.sanitize(content, { USE_PROFILES: { html: true } });
        const parser = new DOMParser();
        const doc = parser.parseFromString(cleanContent, 'text/html');

        const imgTag = doc.querySelector('img');
        const imgSrc = imgTag ? imgTag.src : null;

        if (imgTag) {
            imgTag.remove();
        }
        const textContent = doc.body.textContent || "";

        return { imgSrc, textContent };
    };

    if (!posts) {
        return <div>Loading...</div>;
    }

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
                                                navigate(`/detail-post/${post.id}`);
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
                                                <div className="extra content" style={{ fontSize: 'x-small', textAlign: 'center' }}>
                                                    {post.modifyDate ? `수정일 : ${new Date(post.modifyDate).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: 'numeric',
                                                        minute: 'numeric'
                                                    })}` : `작성일 : ${new Date(post.createDate).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: 'numeric',
                                                        minute: 'numeric'
                                                    })}`}
                                                </div>
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

export default CategoryPosts;
