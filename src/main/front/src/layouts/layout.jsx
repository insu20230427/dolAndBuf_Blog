import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Footer from '../components/footer';
import Header from '../components/header';
import Sidebar from '../components/sidebar';
import { useBlog } from '../contexts/blogContext';
import { Sidebar as SemanticSidebar } from 'semantic-ui-react';
import './layout.css';

const Layout = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const { blogName } = useBlog();

    useEffect(() => {
        if (blogName) {
            const fetchUserId = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/blogs?blogName=${blogName}`);
                    setUserId(response.data.data);
                } catch (error) {
                    console.error('Failed to fetch user ID:', error);
                }
            };

            fetchUserId();
        }
    }, [blogName]);

    const handleSidebarToggle = () => {
        setSidebarVisible(!sidebarVisible);
    };

    return (
        <div className="layout">
            <Header onSidebarToggle={handleSidebarToggle} isSidebarVisible={sidebarVisible} />
            <SemanticSidebar.Pushable>
                <Sidebar userId={userId} visible={sidebarVisible} onClose={() => setSidebarVisible(false)}/>
                <div className="banner">
                    <h1>{blogName}블로그에 오신걸 환영합니다!!</h1>
                    <p>회원가입 및 로그인을 통해 재밌는 블로그 활동을 해주시길 바랍니다 ㅎㅎ</p>
                </div>
                <SemanticSidebar.Pusher>
                    <main className="main-content">
                        {children}
                    </main>
                </SemanticSidebar.Pusher>
            </SemanticSidebar.Pushable>
            <Footer/>
        </div>
    );
};

export default Layout;
