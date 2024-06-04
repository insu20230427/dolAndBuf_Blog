import axios from 'axios';
import Cookies from "js-cookie";
import React, { Component } from 'react';
import { Accordion, AccordionContent, AccordionTitle, Button, Checkbox, Form, Icon, Menu, MenuItem } from 'semantic-ui-react';
import Swal from "sweetalert2";

class CategorySetting extends Component {
    state = {
        category: {},
        categoryData: [],
        activeIndices: [],
        newCategoryName: '', // 새로운 카테고리 이름 저장
        userId: ''
    };

    componentDidMount() {
        this.fetchCategories();
    }

    fetchCategories = () => {
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

        this.setState({ userId });

        axios.get(`http://localhost:8080/api/categories/${userId}`)
            .then(response => {
                this.setState({
                    categoryData: response.data,
                    activeIndices: response.data.map((_, index) => index) // Initialize with all indices active
                });
            })
            .catch(error => {
                console.error('Failed to fetch categories:', error);
            });
    }

    processDropdownData = (data) => {
        const accordionOptions = [];

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

    handleClick = (e, titleProps) => {
        const { index } = titleProps;
        const { activeIndices } = this.state;
        const newIndices = activeIndices.includes(index)
            ? activeIndices.filter(i => i !== index)
            : [...activeIndices, index];
        this.setState({ activeIndices: newIndices });
    };

    // handleCheckboxChange = (e, categoryId) => {
    //     const { categoryData } = this.state;
    //     const updatedCategoryData = categoryData.map(category => {
    //         if (category.id === categoryId || category.parentId === categoryId) {
    //             category.checked = e.target.checked;
    //         }
    //         return category;
    //     });

    //     this.setState({ categoryData: updatedCategoryData });
    // };

    handleDelete = (id, e) => {
        e.stopPropagation();
        Swal.fire({
            title: '정말 삭제하시겠습니까?',
            text: "하위 카테고리와 해당 게시물이 삭제됩니다",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'delete',
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:8080/api/categories/${id}`)
                    .then(() => {
                        this.fetchCategories();
                    })
                    .catch(error => {
                        console.error('Failed to delete category:', error);
                    });
            }
        });
    };

    handleUpdate = (id, e) => {
        e.stopPropagation();
        Swal.fire({
            title: '제목 수정하기',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'edit',
            showLoaderOnConfirm: true,
            preConfirm: (name) => {
                return axios.put(`http://localhost:8080/api/categories/${id}`, { name: name })
                    .then(() => {
                        this.fetchCategories();
                    })
                    .catch(error => {
                        console.error('Failed to update category:', error);
                    });
            },
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: 'success',
                    title: '수정완료!'
                });
            }
        });
    };

    handleNewCategoryChange = (e) => {
        this.setState({ newCategoryName: e.target.value });
    };

    openAddCategoryModal = (parentId, e) => {
        e.stopPropagation();
        console.log(parentId);
        console.log(this.state.userId);
        Swal.fire({
            title: '새 카테고리 추가',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: '추가',
            showLoaderOnConfirm: true,
            preConfirm: (name) => {
                if (!name.trim()) {
                    Swal.showValidationMessage('카테고리 이름을 입력하세요');
                } else {
                    return axios.post('http://localhost:8080/api/categories', {
                        name: name,
                        parentId: parentId,
                        userId: this.state.userId
                    }).then(() => {
                        this.setState({ newCategoryName: '' });
                        this.fetchCategories();
                        Swal.fire({
                            icon: 'success',
                            title: '카테고리가 추가되었습니다'
                        });
                    }).catch(error => {
                        console.error('Failed to add category:', error);
                        Swal.fire({
                            icon: 'error',
                            title: '카테고리 추가에 실패했습니다'
                        });
                    });
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        });
    };

    renderContentForm = (children) => {
        return (
            <Form>
                <Form.Group grouped>
                    {children.map(child => (
                        <Form.Field key={child.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Checkbox label={child.text} name={String(child.key)} value={child.value} />
                            <div style={{ display: 'flex' }}>
                                <Button icon size='small' onClick={(e) => this.handleUpdate(child.key, e)}>
                                    <Icon name='edit' size='small' />
                                </Button>
                                <Button icon size='small' color='google plus' onClick={(e) => this.handleDelete(child.key, e)}>
                                    <Icon name='delete' size='small' />
                                </Button>
                            </div>
                        </Form.Field>
                    ))}
                </Form.Group>
            </Form>
        );
    };

    render() {
        const { activeIndices, categoryData } = this.state;
        const dropdownOptions = this.processDropdownData(categoryData);

        return (
            <div className="container" style={{height: '87vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Accordion as={Menu} vertical>
                    <MenuItem style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <b>카테고리</b>
                        <div style={{ display: 'flex' }}>
                            <Button icon size='small' color='linkedin' onClick={(e) => this.openAddCategoryModal(null, e)} style={{ marginLeft: '10px' }}>
                                <Icon name='add' size='small'/>
                            </Button>
                        </div>
                    </MenuItem>
                    {dropdownOptions.map((option, index) => (
                        <MenuItem key={option.key} >
                            <AccordionTitle
                                active={activeIndices.includes(index)}
                                index={index}
                                onClick={this.handleClick}
                            >
                                <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    {/* <Checkbox label={option.title} onClick={(e) => e.stopPropagation()} /> */}
                                    {option.title}
                                    <div style={{ display: 'flex' }}>
                                        <Button icon size='small' color='linkedin' onClick={(e) => this.openAddCategoryModal(option.key, e)}>
                                            <Icon name='add' size='small' />
                                        </Button>
                                        <Button icon size='small' onClick={(e) => this.handleUpdate(option.key, e)}>
                                            <Icon name='edit' size='small' />
                                        </Button>
                                        <Button icon size='small' color='google plus' onClick={(e) => this.handleDelete(option.key, e)}>
                                            <Icon name='delete' size='small' />
                                        </Button>
                                    </div>
                                </span>
                            </AccordionTitle>
                            <AccordionContent
                                active={activeIndices.includes(index)}
                                content={this.renderContentForm(option.content.content)}
                            />
                        </MenuItem>
                    ))}
                </Accordion>

                {/* 새로운 카테고리 추가 폼 */}
                {/* <Form style={{ marginTop: '20px' }}>
                    <Form.Field>
                        <label>새 카테고리 이름</label>
                        <input
                            placeholder='카테고리 이름 입력'
                            value={newCategoryName}
                            onChange={this.handleNewCategoryChange}
                        />
                    </Form.Field>
                    <Button type='submit' onClick={this.handleAddCategory}>추가</Button>
                </Form> */}
            </div>
        );
    }
}

export default CategorySetting;
