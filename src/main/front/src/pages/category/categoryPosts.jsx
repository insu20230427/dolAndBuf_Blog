import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import {Container, Divider, Icon, Item, Pagination} from 'semantic-ui-react';
import DOMPurify from 'dompurify';
import {useBlog} from "../../contexts/blogContext";
import ChatApp from "../chat/chatApp";

const DEFAULT_THUMBNAIL = 'https://i.namu.wiki/i/_FIKQ7NQtBilT8QtmXWvjY8FfusWX6uYHmoDPsK70tP_vijKovxuPJrT-oEEdhjlXPRCEJy0zR30MwQpVRQ0WA.webp';

const CategoryPosts = () => {
    const [posts, setPosts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const navigate = useNavigate();
    const { categoryId } = useParams();
    const { blogName } = useBlog();

    useEffect(() => {
        if (blogName) {
            const fetchPosts = async (page) => {
                try {
                    const url = categoryId === 'all' || '' ?
                        `http://localhost:8080/api/all/posts/${blogName}?page=${page}` :
                        `http://localhost:8080/api/${categoryId}/posts?page=${page}`;
                    const response = await axios.get(url);
                    const responseData = response.data.data;
                    setPosts(responseData.content);
                    setTotalPages(responseData.totalPages);
                    setCurrentPage(page);
                } catch (error) {
                    console.error('Error fetching posts:', error);
                }
            }

            fetchPosts(currentPage);
        }

    }, [blogName, currentPage, categoryId]);

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
        <div style={{ display: 'flex', position: 'relative' }}>
            <Container>
                <Item.Group style={{ paddingTop: '110px', height: '87vh'}}>
                    {posts.map((post) => {
                        const { imgSrc, textContent } = getThumbnailAndText(post.content);
                        return (
                            <React.Fragment key={post.id}>
                                <Item
                                    style={{ marginTop: '75px', height: '150px' }}
                                    onClick={() => navigate(`/detail-post/${post.id}`)}
                                >
                                    {imgSrc ? (
                                        <img
                                            src={imgSrc}
                                            style={{ marginRight: '20px', width: '130px', height: '90px' }}
                                            alt="thumbnail"
                                        />
                                    ) : (
                                        <img
                                            src="/default-thumbnail.jpg"
                                            style={{ marginRight: '20px', width: '130px', height: '90px' }}
                                            alt="default thumbnail"
                                        />
                                    )}
                                    <Item.Content>
                                        <Item.Header
                                            as="h2"
                                            style={{
                                                fontSize: '1.5em',
                                                marginBottom: '10px',
                                            }}
                                        >
                                            {post.title}
                                        </Item.Header>
                                        <Item.Description style={{ marginBottom: '15px' }}>
                                            {textContent.length >= 15 ? `${textContent.substring(0, 14)}...` : textContent}
                                        </Item.Description>
                                        <Item.Meta>
                                            <span
                                                className="date"
                                                style={{ fontSize: '0.9em' }}
                                            >
                                                {new Date(post.modifyDate).toLocaleDateString('ko-KR', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: 'numeric',
                                                    minute: 'numeric',
                                                })}
                                            </span>
                                        </Item.Meta>
                                    </Item.Content>
                                </Item>
                                <Divider style={{ margin: '10px 0' }} />
                            </React.Fragment>
                        );
                    })}
                </Item.Group>

                <Container textAlign="center" style={{ marginBottom: '40px' }}>
                    <Pagination
                        defaultActivePage={currentPage + 1}
                        totalPages={totalPages}
                        onPageChange={(e, { activePage }) => handlePageClick(activePage - 1)}
                        ellipsisItem={{ content: <Icon name="ellipsis horizontal" />, icon: true }}
                        firstItem={{ content: <Icon name="angle double left" />, icon: true }}
                        lastItem={{ content: <Icon name="angle double right" />, icon: true }}
                        prevItem={{ content: <Icon name="angle left" />, icon: true }}
                        nextItem={{ content: <Icon name="angle right" />, icon: true }}
                    />
                </Container>
                {/* <ChatApp /> */}
            </Container>
            <div>
                <ChatApp />
            </div>
        </div>
    );
};
export default CategoryPosts;
