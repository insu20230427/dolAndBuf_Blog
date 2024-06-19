import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState, useRef } from "react";
import { Form } from "react-bootstrap";
import ReactQuill, { Quill } from "react-quill";
import ImageResize from "quill-image-resize-module-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Dropdown, DropdownItem, DropdownMenu, Icon } from "semantic-ui-react";
import Swal from 'sweetalert2';
import 'react-quill/dist/quill.snow.css';

Quill.register("modules/imageResize", ImageResize);

export default function UpdatePost() {
    const [detailPost, setDetailPost] = useState({});
    const [categoryData, setCategoryData] = useState([]);
    const [category, setCategory] = useState({});
    const navigate = useNavigate();
    const { id } = useParams();
    const quillRef = useRef(null);

    useEffect(() => {
        fetchPosts();
        fetchCategories();
    }, []);

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
                    quill.insertEmbed(range.index, 'image', `http://localhost:8080${data}`); // 서버에서 반환된 이미지 URL
                    quill.setSelection(range.index + 1);
                } catch (error) {
                    quill.deleteText(range.index, 1);
                    console.error('Error uploading image: ', error);
                }
            };
        };

        if (quillRef.current) {
            const toolbar = quillRef.current.getEditor().getModule("toolbar");
            toolbar.addHandler("image", imageHandler);
        }
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/posts/${id}`);
            setDetailPost(response.data.data);
            setCategory(response.data.data.category); // Fetch the category of the post
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const fetchCategories = async () => {
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

        try {
            const response = await axios.get(`http://localhost:8080/api/categories/${userId}`);
            console.log(response.data);
            setCategoryData(response.data);
            if (response.data && response.data.length === 0) {
                Swal.fire({
                    icon: 'info',
                    title: '카테고리가 존재하지 않습니다.',
                }).then(() => {
                    navigate('/category-setting');
                });
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

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
        console.log(category);
    };

    if (!detailPost.title && !detailPost.content && !id) {
        return alert("loading...");
    }

    // const containerStyle = {
    //     height: '87vh'
    // }

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:8080/api/posts/${id}`, {
                content: detailPost.content,
                title: detailPost.title,
                categoryId: category.id
            });
            Swal.fire({
                icon: 'success',
                text: '게시글 수정 성공.'
            }).then(() => {
                navigate(`/detail-post/${id}`);
            });
        } catch (error) {
            console.error('게시글 수정 실패:', error);
            await Swal.fire({
                icon: 'error',
                text: '게시글 수정 실패. 다시 시도해주세요'
            });
            //navigate(`/detail-post/${id}`);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/posts/${id}`);
            Swal.fire({
                icon: 'success',
                text: '게시글 삭제 성공.'
            }).then(() => {
                navigate('/');
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: '게시글 삭제 실패. 다시 시도해주세요'
            }).then(() => {
                navigate(`/detail-post/${id}`);
            });
        }
    };

    const modules = {
        toolbar: {
            container: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ color: [] }, { background: [] }],
                [{ align: [] }, 'link', 'image'],
            ],
        },
        imageResize: {
            parchment: Quill.import("parchment"),
            modules: ["Resize", "DisplaySize", "Toolbar"],
        },
    };

    return (
        <>
            <br />
            <br />
            <div className="container">
                <Form>
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
                            value={detailPost.title}
                            onChange={(e) => setDetailPost({
                                ...detailPost,
                                title: e.target.value
                            })}
                        />
                    </Form.Group>
                    <br />
                    <Form.Group>
                        <ReactQuill
                            ref={quillRef}
                            theme="snow"
                            value={detailPost.content}
                            onChange={(value) => setDetailPost({
                                ...detailPost,
                                content: value
                            })}
                            modules={modules}
                            style={{ height: '700px' }}
                        />
                    </Form.Group>
                    <br /><br /><br /><br />
                    <div style={{ textAlign: 'center' }}>
                        <Button icon onClick={() => navigate('/')}>
                            <Icon name="arrow left" />
                        </Button>
                        <Button icon
                            type="button"
                            onClick={handleUpdate}>
                            <Icon name="cut" />
                        </Button>
                        <Button icon
                            type="button"
                            onClick={handleDelete}>
                            <Icon name="trash alternate" />
                        </Button>
                    </div>
                    <br /><br />
                </Form>
            </div>
        </>
    );
}
