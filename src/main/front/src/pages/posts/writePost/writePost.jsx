import axios from 'axios';
import Cookies from "js-cookie";
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import { Form } from 'react-bootstrap';
import 'react-quill/dist/quill.snow.css'; // Quill 에디터 스타일
import { useNavigate } from 'react-router-dom';
import { Button, Dropdown, DropdownItem, DropdownMenu, Icon } from 'semantic-ui-react';
import Swal from "sweetalert2";

const WritePost = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState({});
    const [categoryData, setCategoryData] = useState([]);

    const containerStyle = {
        height: '87vh'
    }

    useEffect(() => {

        const jwtToken = Cookies.get('Authorization');
        if (!jwtToken) {
            console.error('JWT Token not found');
            return;
        }

        const jwtParts = jwtToken.split(' ');
        if (jwtParts.length !== 2) {
            console.error('Invalid JWT Token format');
            return;
        }

        const token = jwtParts[1];

        // 토큰을 "." 으로 분리하여 배열로 만듦
        const parts = token.split('.');

        // Payload 부분 추출 (인덱스 1)
        const payload = parts[1];

        // Base64 디코딩 후 JSON 파싱
        const userId = JSON.parse(atob(payload)).userId;

        const fetchCategories = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/categories/${userId}`);
                console.log(response.data);
                setCategoryData(response.data);
                if(response.data && response.data.length === 0){
                    Swal.fire({
                        icon: 'alert',
                        title: "카테고리가 존재하지 않습니다."
                    }).then(() => {
                        navigate('/category-setting');
                    });
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const processDropdownData = (data) => {
        const accordionOptions = [];

        // 상위 카테고리를 찾아서 하위 카테고리를 추가하는 함수
        const findChildren = (parentId) => {
            return Object.values(data).filter(child => child.parentId === parentId).map(child => ({
                key: child.id,
                text: child.name,
                value: child.id
            }));
        };

        Object.values(data).forEach(category => {
            if (category.parentId === null) {
                accordionOptions.push({
                    key: category.id,
                    title: category.name,
                    content: {
                        key: category.id,
                        content: findChildren(category.id)
                    }
                });
            }
        });

        return accordionOptions;
    };

    // 주어진 데이터를 동적으로 처리하여 드롭다운 옵션으로 가공
    const dropdownOptions = processDropdownData(categoryData);

    console.log(category);
    const handleCategoryChange = (e, { value }) => {
        e.preventDefault();
        setCategory(categoryData.find(cat => cat.id === value));
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();

        try {

            const response = await axios.post(`http://localhost:8080/api/posts?categoryId=${category.id}`, {
                title: title,
                content: content
            }, {
                headers: {
                    'Authorization': Cookies.get('Authorization'),
                }
            });

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    text: '게시글 작성 성공.'
                }).then(() => {
                    navigate('/');
                })
            }
        } catch (error) {
            console.error('게시글 작성 실패:', error);
            await Swal.fire({
                icon: 'error',
                text: '게시글 작성 실패.'
            })
        }
    };

    return (
        <>

            <br />
            <br />
            <div className="container" style={containerStyle}>
                <Form onSubmit={handlePostSubmit}>
                    <Form.Group>
                        {/* <Form.Control as="select" value={category}
                            onChange={(e) => setCategory(e.target.value)} style={{ width: '30%' }}>
                            <option value="" disabled>category</option>

                        </Form.Control> */}
                        <Dropdown
                            placeholder='Select a category'
                            fluid
                            pointing className='item'
                            text={category !== null ? category.name : 'Select a category'}
                            style={{
                                width: '30%',
                                border: '1px solid #bbb',
                                padding: '5px',
                                paddingLeft: '10px',
                                borderRadius: '4px',
                                color: 'black'
                            }}
                            >
                            <DropdownMenu>
                                {dropdownOptions.map(cat => (
                                    <DropdownItem key={cat.key}>
                                        <Dropdown text={cat.title} pointing='left' className='link item'>
                                            <DropdownMenu>
                                                {cat.content.content && cat.content.content.map(child => (
                                                    <DropdownItem key={child.key} value={child.value}
                                                        onClick={handleCategoryChange}>
                                                        {child.text}
                                                    </DropdownItem>
                                                ))}
                                            </DropdownMenu>
                                        </Dropdown>
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </Form.Group>
                    <br />
                    <Form.Group>
                        <Form.Control
                            type="text"
                            placeholder="Enter title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Form.Group>
                    <br />
                    <Form.Group>
                        <ReactQuill
                            theme="snow"
                            value={content}
                            onChange={setContent} // ReactQuill가 알아서 setContent에 content를 넣어줌
                            placeholder="Write your content here..."
                            style={{ height: '700px' }}
                        />
                    </Form.Group>
                    <br /><br /><br /><br /><br />
                    <div style={{ textAlign: 'center' }}>
                        <Button icon onClick={() => navigate('/')}>
                            <Icon name="arrow left" />
                        </Button>
                        <Button icon type="submit">
                            <Icon name="edit" />
                        </Button>
                    </div>
                </Form>
            </div>

        </>
    );
};

export default WritePost;