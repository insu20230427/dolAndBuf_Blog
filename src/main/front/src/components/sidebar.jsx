import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './sidebar.css';
import { Icon } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import Cookies from 'js-cookie';

const Sidebar = ({ userId, visible, onClose }) => {
    const [categories, setCategories] = useState([]);
    const [totalPostsCount, setTotalPostsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedCategoryId, setSelectedCategoryId] = useState('all');
    const [expandedCategories, setExpandedCategories] = useState({});
    const [isOwner, setIsOwner] = useState(false);
    const sidebarRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (userId) {
            const fetchCategories = async () => {
                setLoading(true);
                try {
                    const response = await axios.get(`http://localhost:8080/api/categories/${userId}`);
                    const fetchedCategories = response.data;
                    setTotalPostsCount(fetchedCategories.reduce((acc, cat) => acc + cat.postCount, 0));
                    setCategories([{
                        id: 'all', name: '전체보기', parentId: null, postCount: totalPostsCount,
                        childrenId: []
                    }, ...fetchedCategories]);
                } catch (error) {
                    console.error('Failed to fetch categories:', error);
                }
                setLoading(false);
            };
            fetchCategories();
        }

        const jwtToken = Cookies.get('Authorization');
        if (!jwtToken) {
            console.error('JWT Token not found');
            return;
        } else {
            const jwtParts = jwtToken.split(' ');
            const token = jwtParts[1];
            const parts = token.split('.');
            const payload = parts[1];
            const currentUserId = JSON.parse(atob(payload)).userId;

            if (currentUserId === userId) {
                setIsOwner(true);
            } else {
                setIsOwner(false);
            }
        }

    }, [userId]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (visible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [visible, onClose]);


    const updateSidebarCategories = (updatedCategories) => {
        setCategories([{
            id: 'all', name: '전체보기', parentId: null, postCount: updatedCategories.reduce((acc, cat) => acc + cat.postCount, 0),
            childrenId: []
        }, ...updatedCategories]);
    };

    const toggleCategory = (id) => {
        setExpandedCategories(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleCategoryClick = (id) => {
        setSelectedCategoryId(id);
        toggleCategory(id);
        navigate(`/posts/${id}`);
    };

    const renderCategories = (categories) => {
        return (
            <div className="menu">
                <div
                    className={`menu-item ${selectedCategoryId === 'all' ? 'menu-item-active' : ''}`}
                    onClick={() => handleCategoryClick('all')}
                >
                    전체보기 ({totalPostsCount})
                </div>
                {categories.filter(cat => cat.id !== 'all' && cat.parentId === null).map(category => (
                    <React.Fragment key={category.id}>
                        <div
                            className={`menu-item ${selectedCategoryId === category.id ? 'menu-item-active' : ''}`}
                            onClick={() => { toggleCategory(category.id); setSelectedCategoryId(category.id); }}
                        >
                            <span className="menu-link">
                                <Icon name={expandedCategories[category.id] ? 'angle down' : 'angle right'} />
                                {category.name}
                            </span>
                        </div>
                        {category.childrenId && category.childrenId.length > 0 && expandedCategories[category.id] && (
                            <div className="menu-submenu">
                                {category.childrenId.map(childId => {
                                    const childCategory = categories.find(cat => cat.id === childId);
                                    return (
                                        <div
                                            key={childId}
                                            className={`menu-item ${selectedCategoryId === childId ? 'menu-item-active' : ''}`}
                                            onClick={() => handleCategoryClick(childId)}
                                        >
                                            - {childCategory.name} ({childCategory.postCount})
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    return (
        <div ref={sidebarRef} className={`sidebar ${visible ? 'visible' : ''}`}>
            {renderCategories(categories)}
            {isOwner && (
                <div className="menu-item">
                    <Link to={'/category-setting'} className="menu-link" style={{ color: '#ccc' }}>
                        <Icon name='setting' /> 설정
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
