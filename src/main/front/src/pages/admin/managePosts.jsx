import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Input, Dropdown, Pagination, Icon, Container } from 'semantic-ui-react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import styles from './managePosts.module.css';

const ManagePosts = () => {
    const [posts, setPosts] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchType, setSearchType] = useState('title');
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const navigate = useNavigate();
    const validToken = Cookies.get('Authorization');

    useEffect(() => {
        const fetchPosts = async (page) => {
            try {
                const response = await axios.get(`http://localhost:8080/api/admin/posts?page=${page}`, {
                    headers: {
                        'Authorization': validToken
                    }
                });
                setPosts(response.data.data.content);
                setTotalPages(response.data.data.totalPages);
                setCurrentPage(page);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts(currentPage);
    }, [validToken, currentPage]);

    const handleEdit = (postId) => {
        navigate(`/update-post/${postId}`);
    };

    const handleDelete = async (postId) => {
        try {
            await axios.delete(`http://localhost:8080/api/posts/${postId}`, {
                headers: {
                    'Authorization': Cookies.get('Authorization')
                }
            });
            Swal.fire({
                icon: 'success',
                text: '게시글 삭제 성공.'
            }).then(() => {
                setPosts(posts.filter(post => post.id !== postId));
            });
        } catch (error) {
            console.error('게시글 삭제 실패:', error);
            await Swal.fire({
                icon: 'error',
                text: '게시글 삭제 실패.'
            });
        }
    };

    const handleSearch = () => {
        // 검색 기능 구현
    };

    const handlePageChange = (e, { activePage }) => {
        setCurrentPage(activePage - 1);
    };

    return (
        <div className={styles.managePosts}>
            <h3 className={styles.title}>
                <span>글 관리 <span className={styles.count}>{posts.length}</span></span>
                <Link to="/write" className={styles.writeLink}>
                    글 쓰기 <Icon name="write" />
                </Link>
            </h3>
            <div className={styles.searchContainer}>
                <div className={styles.checkboxContainer}>
                    <Input type="checkbox" id="selectAll" className={styles.checkbox} />
                    <label htmlFor="selectAll" className={styles.checkboxLabel}>선택 됨</label>
                </div>
                <div className={styles.statusChangeContainer}>
                    <Button type="button" className={styles.changeButton} disabled>
                        변경 <Icon name="caret down" />
                    </Button>
                    <div className={styles.statusOptions}>
                        <Button type="button" className={styles.statusOption}>공개</Button>
                        <Button type="button" className={styles.statusOption}>비공개</Button>
                        <Button type="button" className={styles.statusOption}>삭제</Button>
                    </div>
                </div>
                <form className={styles.searchForm}>
                    <Dropdown
                        button
                        className={styles.searchDropdown}
                        options={[
                            { key: 'title', text: '제목', value: 'title' },
                            { key: 'content', text: '내용', value: 'content' },
                            { key: 'titleAndContent', text: '제목+내용', value: 'titleAndContent' },
                        ]}
                        onChange={(e, { value }) => setSearchType(value)}
                        defaultValue='title'
                        text='제목'
                    />
                    <Input
                        type="text"
                        className={styles.searchInput}
                        placeholder="글 관리에서 검색합니다."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                    <Button type="button" className={styles.searchButton} onClick={handleSearch}>
                        검색 <Icon name="search" />
                    </Button>
                </form>
            </div>
            <div className={styles.postsList}>
                {posts.length > 0 ? (
                    posts.map(post => (
                        <div className={styles.postItem} key={post.id}>
                            <Input type="checkbox" className={styles.postCheckbox} />
                            <div className={styles.postContent}>
                                <strong className={styles.postTitle}>
                                    <a href={`/detail-post/${post.id}`}>{post.title}</a>
                                </strong>
                                <div className={styles.postMeta}>
                                    <span className={styles.postCategory}>{post.category.name}</span>
                                    <span className={styles.postAuthor}>{post.user.nickname}</span>
                                    <span className={styles.postDate}>{new Date(post.modifyDate).toLocaleString()}</span>
                                    {post.replyList && post.replyList.length > 0 ? (<span className={styles.postComments}>댓글 {post.replyList.length}</span>) : (<></>)}
                                </div>
                            </div>
                            <div className={styles.postActions}>
                                <Button className={styles.postAction} onClick={() => handleEdit(post.id)}>수정</Button>
                                <Button className={styles.postAction} onClick={() => handleDelete(post.id)}>삭제</Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.noPosts}>아직 등록된 게시글이 없습니다</div>
                )}
            </div>
            <Container textAlign="center" style={{ padding: '20px', paddingBottom: '100px', margin: 'auto' }}>
                <Pagination
                    defaultActivePage={currentPage + 1}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    ellipsisItem={{ content: <Icon name="ellipsis horizontal" />, icon: true }}
                    firstItem={{ content: <Icon name="angle double left" />, icon: true }}
                    lastItem={{ content: <Icon name="angle double right" />, icon: true }}
                    prevItem={{ content: <Icon name="angle left" />, icon: true }}
                    nextItem={{ content: <Icon name="angle right" />, icon: true }}
                />
            </Container>
        </div>
    );
};

export default ManagePosts;
