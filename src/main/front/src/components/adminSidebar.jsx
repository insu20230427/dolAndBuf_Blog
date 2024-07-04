import React from 'react';
import { Link } from 'react-router-dom';
import './adminSidebar.css';

const AdminSidebar = () => {
    return (
        <nav className="admin-sidebar">
            <div className="admin-sidebar-header">
                <h2>관리자 메뉴</h2>
            </div>
            <ul>
                <li>
                    <Link to="/admin">블로그 관리 홈</Link>
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
