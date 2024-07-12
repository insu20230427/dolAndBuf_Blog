import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie';
import ImageResize from 'quill-image-resize-module-react';
import React, { useEffect, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import { Button, Dropdown, DropdownItem, DropdownMenu, Icon } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import EditorToolBar from '../../../components/EditorToolBar';

// quill-image-resize-module-react를 Quill 모듈로 등록합니다.
Quill.register('modules/imageResize', ImageResize);

const WritePost = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState(null);
    const [categoryData, setCategoryData] = useState([]);
    const quillRef = useRef(null);

    const modules = {
        toolbar: {
            container: "#toolbar", // EditorToolBar에서 정의한 #toolbar를 사용
            handlers: {},
        },
        history: {
            delay: 500,
            maxStack: 100,
            userOnly: true,
        },
        imageResize: {
            // quill-image-resize-module-react 설정
            parchment: Quill.import('parchment'),
            modules: ['Resize', 'DisplaySize', 'Toolbar'],
        },
    };

    const formats = [
        "font",
        "size",
        "header",
        "color",
        "background",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
    ];

    useEffect(() => {
        const imageHandler = () => {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            input.click();

            input.onchange = async () => {
                const file = input.files[0];
                const formData = new FormData();
                formData.append('image', file);

                const quill = quillRef.current.getEditor();
                const range = quill.getSelection();

                try {
                    const res = await axios.post('http://localhost:8080/api/upload/image', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    const data = res.data;
                    quill.insertEmbed(range.index, 'image', `http://localhost:8080${data}`); // 서버에서 반환된 이미지 URL을 사용해야 함
                    quill.setSelection(range.index + 1);
                } catch (error) {
                    quill.deleteText(range.index, 1);
                    console.error('Error uploading image: ', error);
                }
            };
        };

        if (quillRef.current) {
            const toolbar = quillRef.current.getEditor().getModule('toolbar');
            toolbar.addHandler('image', imageHandler);
        }
    }, []);

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
        const parts = token.split('.');
        const payload = parts[1];
        const userId = JSON.parse(atob(payload)).userId;

        const fetchCategories = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/categories/${userId}`);
                console.log(response.data);
                setCategoryData(response.data);
                if (response.data && response.data.length === 0) {
                    Swal.fire({
                        icon: 'info',
                        title: '카테고리가 존재하지 않습니다.',
                    }).then(() => {
                        navigate('/admin/category-setting');
                    });
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };

        fetchCategories();
    }, [navigate]);

    const processDropdownData = (data) => {
        const accordionOptions = [];
        const findChildren = (parentId) => {
            return Object.values(data)
                .filter((child) => child.parentId === parentId)
                .map((child) => ({
                    key: child.id,
                    text: child.name,
                    value: child.id,
                }));
        };

        Object.values(data).forEach((category) => {
            if (category.parentId === null) {
                accordionOptions.push({
                    key: category.id,
                    title: category.name,
                    content: {
                        key: category.id,
                        content: findChildren(category.id),
                    },
                });
            }
        });

        return accordionOptions;
    };

    const dropdownOptions = processDropdownData(categoryData);

    const handleCategoryChange = (e, { value }) => {
        e.preventDefault();
        setCategory(categoryData.find((cat) => cat.id === value));
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                'http://localhost:8080/api/posts',
                {
                    title: title,
                    content: content,
                    categoryId: category.id
                },
                {
                    headers: {
                        'Content-Type': 'application/json', // JSON 형식으로 설정
                        Authorization: Cookies.get('Authorization'),
                    },
                }
            );

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    text: '게시글 작성 성공.',
                }).then(() => {
                    navigate('/');
                });
            }
        } catch (error) {
            console.error('게시글 작성 실패:', error);
            await Swal.fire({
                icon: 'error',
                text: '게시글 작성 실패.',
            });
        }
    };

    return (
        <>
            <br />
            <br />
            <div className="container">
                <Form style={{display: 'block'}} onSubmit={handlePostSubmit}>
                    <Form.Group>
                        <Dropdown
                            placeholder="Select a category"
                            fluid
                            pointing
                            className="item"
                            text={category !== null ? category.name : 'Select a category'}
                            style={{
                                width: '30%',
                                border: '1px solid #bbb',
                                padding: '5px',
                                paddingLeft: '10px',
                                borderRadius: '4px',
                                color: 'black',
                            }}
                        >
                            <DropdownMenu>
                                {dropdownOptions.map((cat) => (
                                    <DropdownItem key={cat.key}>
                                        <Dropdown text={cat.title} pointing="left" className="link item">
                                            <DropdownMenu>
                                                {cat.content.content &&
                                                    cat.content.content.map((child) => (
                                                        <DropdownItem key={child.key} value={child.value} onClick={handleCategoryChange}>
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
                        <EditorToolBar /> {/* EditorToolBar 컴포넌트 추가 */}
                        <ReactQuill
                            ref={quillRef}
                            modules={modules}
                            formats={formats}
                            theme="snow"
                            value={content}
                            onChange={(val) => setContent(val)}
                            placeholder="Write your content here..."
                            style={{ height: '700px' }}
                        />
                    </Form.Group>
                    <br /><br /><br /><br />
                    <div style={{ textAlign: 'center' }}>
                        <Button icon onClick={() => navigate('/')}>
                            <Icon name="arrow left" />
                        </Button>
                        <Button icon type="submit">
                            <Icon name="edit" />
                        </Button>
                    </div>
                    <br /><br />
                </Form>
            </div>
        </>
    );
};

export default WritePost;
