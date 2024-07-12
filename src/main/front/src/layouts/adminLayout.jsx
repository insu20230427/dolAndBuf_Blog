import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './adminLayout.css';
import AdminSidebar from '../components/adminSidebar';

const AdminLayout = () => {
    return (
        <div className="admin-app">
            <AdminSidebar />
            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
