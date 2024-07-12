import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import DOMPurify from 'dompurify';
import React, { useEffect, useState } from 'react';
import { Pagination } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import { Container, Divider, GridColumn, Icon, Item, Message } from 'semantic-ui-react';

import '../../index/index.css';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const DEFAULT_THUMBNAIL = 'https://i.namu.wiki/i/_FIKQ7NQtBilT8QtmXWvjY8FfusWX6uYHmoDPsK70tP_vijKovxuPJrT-oEEdhjlXPRCEJy0zR30MwQpVRQ0WA.webp';

const SearchPost = () => {
    const query = useQuery();
    const searchType = query.get('type');
    const searchKeyword = query.get('keyword') ? query.get('keyword').trim() : '';

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
                const response = await axios.get(`http://localhost:8080/api/posts/search?type=${searchType}&keyword=${encodeURIComponent(searchKeyword)}&page=${page}`);
                setPosts(response.data.data.content);
                setTotalPages(response.data.data.totalPages);
                setCurrentPage(page);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts(currentPage);

    }, [currentPage, searchType, searchKeyword]);

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const getThumbnailAndText = (content) => {
        const cleanContent = DOMPurify.sanitize(content, { USE_PROFILES: { html: true } });
        const parser = new DOMParser();
        const doc = parser.parseFromString(cleanContent, 'text/html');

        const imgTag = doc.querySelector('img');
        const imgSrc = imgTag ? imgTag.src : DEFAULT_THUMBNAIL;

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
        <Container>
            <Item.Group style={{ paddingTop: '110px', minHeight: '87vh' }}>
                {posts.length > 0 ? (
                    posts.map(post => {
                        const { imgSrc, textContent } = getThumbnailAndText(post.content);
                        return (
                            <React.Fragment key={post.id}>
                                <Item className="post-item" style={{ margin: '20px 0', height: '150px' }}
                                    onClick={() => navigate(`/detail-post/${post.id}`)}>
                                    {imgSrc ? (
                                        <img src={imgSrc} style={{ paddingLeft: '20px', marginRight: '20px', width: '130px', height: '90px' }}
                                            alt="thumbnail" />
                                    ) : (
                                        <img src="/default-thumbnail.jpg"
                                            style={{ marginRight: '20px', width: '130px', height: '90px' }}
                                            alt="default thumbnail" />
                                    )}
                                    <Item.Content>
                                        <Item.Header as='h2' className="post-header">{post.title}</Item.Header>
                                        <Item.Description className="post-description">
                                            {textContent.length >= 15 ? `${textContent.substring(0, 14)}...` : textContent}
                                        </Item.Description>
                                        <Item.Meta>
                                            <span className='date'>
                                                {post.modifyDate ? (
                                                    `수정일 : ${new Date(post.modifyDate).toLocaleDateString('ko-KR', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: 'numeric',
                                                        minute: 'numeric'
                                                    })}`
                                                ) : (
                                                    `작성일 : ${new Date(post.createDate).toLocaleDateString('ko-KR', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: 'numeric',
                                                        minute: 'numeric'
                                                    })}`
                                                )}
                                            </span>
                                        </Item.Meta>
                                    </Item.Content>
                                </Item>
                                <Divider className="post-divider" />
                            </React.Fragment>
                        );
                    })
                ) : (
                    <GridColumn width={16}>
                        <Message icon style={{ textAlign: 'center', margin: '20px auto', width: '300px' }}>
                            <Icon name='search' />
                            <Message.Content>
                                <Message.Header>검색 결과가 없습니다</Message.Header>
                                <p>검색 조건에 맞는 게시물을<br />찾을 수 없습니다.</p>
                            </Message.Content>
                        </Message>
                    </GridColumn>
                )}
            </Item.Group>

            <Container textAlign='center' style={{ marginBottom: '40px' }}>
                <Pagination
                    defaultActivePage={currentPage + 1}
                    totalPages={totalPages}
                    onPageChange={(e, { activePage }) => handlePageClick(activePage - 1)}
                    ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
                    firstItem={{ content: <Icon name='angle double left' />, icon: true }}
                    lastItem={{ content: <Icon name='angle double right' />, icon: true }}
                    prevItem={{ content: <Icon name='angle left' />, icon: true }}
                    nextItem={{ content: <Icon name='angle right' />, icon: true }}
                />
            </Container>
        </Container>
    );
};

export default SearchPost;
