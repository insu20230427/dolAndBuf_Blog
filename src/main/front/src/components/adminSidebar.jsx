import React from 'react';
import { Link } from 'react-router-dom';
import './adminSidebar.css';

const AdminSidebar = () => {
    return (
        <nav className="admin-sidebar">
            <ul>
                <li>
                    <div className="admin-sidebar-header"> 
                        <Link to="/admin" className="admin-home-link">블로그 관리 홈</Link>
                    </div>
                </li>
                <li>
                    <Link to="/admin/manage-posts">게시글 관리</Link>
                </li>
                <li>
                    <Link to="/admin/manage-replies">댓글 관리</Link>
                </li>
                <li>
                    <Link to="/admin/category-setting">카테고리 관리</Link>
                </li>
                <li>
                    <Link to="/admin/banner-setting">배너 관리</Link>
                </li>
            </ul>
        </nav>
    );
};

export default AdminSidebar;
