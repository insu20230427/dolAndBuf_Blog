import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import './sidebar.css';
import Cookies from "js-cookie";
import {Icon} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

const Sidebar = ({ userId }) => {
    const [categories, setCategories] = useState([]);
    const [totalPostsCount, setTotalPostsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedCategoryId, setSelectedCategoryId] = useState('all');
    const [expandedCategories, setExpandedCategories] = useState({});
    const [visible, setVisible] = useState(false);

    useEffect(() => {
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
        const visitorId = JSON.parse(atob(payload)).userId;

        if (visitorId === userId) {
            setVisible(true);
        }

    }, [userId]);

    const toggleCategory = (id) => {
        setExpandedCategories(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleCategoryClick = (id) => {
        setSelectedCategoryId(id);
        toggleCategory(id);
    };

    const renderCategories = (categories) => {
        return (
            <div className="ui link list">
                <div className={`item ${selectedCategoryId === 'all' ? 'active' : ''}`}
                    onClick={() => handleCategoryClick('all')}>
                    <Link to={`/posts/all`} onClick={() => setSelectedCategoryId('all')}>
                        전체보기 ({totalPostsCount})
                    </Link>
                </div>

                {categories.map(category => (
                    <div key={category.id} className='item'>
                        <div onClick={() => handleCategoryClick(category.id)} className="category content">
                            {category.id === 'all' ? (<></>)
                                : (
                                    <>
                                        {category.childrenId && category.childrenId.length > 0 && (
                                            <i onClick={(e) => { e.stopPropagation(); toggleCategory(category.id); }}
                                                className={`caret ${expandedCategories[category.id] ? 'down' : 'right'} icon`}>
                                                &nbsp; {category.name}
                                            </i>
                                        )}
                                    </>
                                )}
                        </div>
                        {expandedCategories[category.id] && (
                            <>
                                {category.childrenId.map(childId => (
                                    <div key={childId} className={`item ${selectedCategoryId === childId ? 'active' : ''}`}
                                        style={{ textIndent: '10px' }}>
                                        <Link to={`/posts/${childId}`} onClick={() => { setSelectedCategoryId(childId); }}>
                                            - {categories.find(cat => cat.id === childId).name}
                                            ({categories.find(cat => cat.id === childId).postCount})
                                        </Link>

                                    </div>
                                ))}

                            </>
                        )}

                    </div>
                ))}

            </div>
        );
    };

    if (loading) {
        return <div className="sidebar-loading">로딩 중...</div>;
    }

    return (
        <div className="sidebar" style={{display : 'flex'}}>
            {renderCategories(categories)}
            {visible && (
                <Link to={'/category-setting' } style={{color:'#ccc'}}>
                    <Icon name='setting'/>
                </Link>
            )}
        </div>
    );
};

export default Sidebar;
