import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css';

const Sidebar = ({ userId }) => {
    const [categories, setCategories] = useState([]);
    const [totalPosts, setTotalPosts] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedCategoryId, setSelectedCategoryId] = useState('all'); // 선택된 카테고리 ID 상태 추가

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                console.log(userId);
                const response = await axios.get(`http://localhost:8080/api/categories/${userId}`);
                console.log(response.data.data);
                const fetchedCategories = response.data.data;
                const rootCategories = fetchedCategories.filter(cat => !cat.parent);
                const totalPostsCount = fetchedCategories.reduce((acc, cat) => acc + cat.posts.length, 0);

                setTotalPosts(totalPostsCount);
                setCategories([{ id: 'all', name: '전체보기', posts: Array(totalPostsCount).fill({}) }, ...rootCategories]);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
            setLoading(false);
        };

        fetchCategories();
        console.log(categories);

    }, [userId]);
    console.log(categories);

    const renderCategories = (categories) => {
        return categories.map(category => (
            <li key={category.id} className={selectedCategoryId === category.id ? 'selected' : ''}>
                <Link to={`/posts/${category.id}`} onClick={() => setSelectedCategoryId(category.id)}>
                    {category.name} ({category.posts ? category.posts.length : 0})
                </Link>
                {category.subCategories && <ul>{renderCategories(category.subCategories)}</ul>}
            </li>
        ));
    };
    console.log(categories);


    if (loading) {
        return <div className="sidebar-loading">로딩 중...</div>;
    }

    return (
        <div className="sidebar">
            <ul className='category-list'>
                {renderCategories(categories)}
            </ul>
        </div>
    );
};

export default Sidebar;
