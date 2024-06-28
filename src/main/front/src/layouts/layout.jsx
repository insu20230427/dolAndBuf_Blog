import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Footer from '../components/footer';
import Header from '../components/header';
import Sidebar from '../components/sidebar';
import { useBlog } from '../contexts/blogContext';
import { Sidebar as SemanticSidebar } from 'semantic-ui-react';
import './layout.css';
import Cookies from 'js-cookie';

const Layout = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [bannerInfo, setBannerInfo] = useState({ bannerImageUrl: '', bannerDescription: '', username: '' });
    const [bannerInfoByBlogName, setBannerInfoByBlogName] = useState({ bannerImageUrl: '', bannerDescription: '', username: '' });
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
        
            const fetchBannerInfoByPrincipal = async () => {
                try {
                    const response = await axios.get('http://localhost:8080/api/banners', {
                        withCredentials: true,
                        headers: {
                            Authorization: Cookies.get('Authorization')
                        }
                    });
                    if (response.status === 200 && response.data.data) {
                        setBannerInfo({
                            bannerImageUrl: response.data.data.bannerImageUrl,
                            bannerDescription: response.data.data.bannerDescription,
                            username: response.data.data.username, 
                        });
                    }
                } catch (error) {
                    console.error('Failed to fetch banner info:', error);
                }
            };

            const fetchBannerInfoByBlogName = async () => {
                try {
                    if(blogName === '') return;
                    const response = await axios.get(`http://localhost:8080/api/banners/${blogName}`, {
                        withCredentials: true,
                        headers: {
                            Authorization: Cookies.get('Authorization')
                        }
                    });
                    if (response.status === 200 && response.data.data) {
                        setBannerInfoByBlogName({
                            bannerImageUrl: response.data.data.bannerImageUrl,
                            bannerDescription: response.data.data.bannerDescription,
                            username: response.data.data.username, 
                        });
                    }
                } catch (error) {
                    console.error('Failed to fetch banner info:', error);
                }
            };

            fetchBannerInfoByPrincipal();
            fetchBannerInfoByBlogName();
        }
    }, [blogName]);

    const handleSidebarToggle = () => {
        setSidebarVisible(!sidebarVisible);
    };

    return (
        <div className="layout">
            <Header onSidebarToggle={handleSidebarToggle} isSidebarVisible={sidebarVisible} />
            <SemanticSidebar.Pushable>
                <Sidebar userId={userId} visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
                <SemanticSidebar.Pusher>
                    {blogName === '' ? (
                        <div className="banner">
                            <h1>블로그에 오신걸 환영합니다!!</h1>
                            <p>회원가입 및 로그인을 통해 재밌는 블로그 활동을 해주시길 바랍니다 ㅎㅎ</p>
                        </div>
                    ) : bannerInfo.username === blogName && bannerInfo.bannerImageUrl && bannerInfo.bannerDescription ? (
                        <div className="banner">
                            <h1>{blogName}블로그</h1>
                            <img src={bannerInfo.bannerImageUrl} alt="Banner" />
                            <p>{bannerInfo.bannerDescription}</p>
                        </div>
                    ) : (
                        <div className="banner">
                            <h1>{blogName}블로그</h1>
                            <img src={bannerInfoByBlogName.bannerImageUrl} alt="Banner" />
                            <p>{bannerInfoByBlogName.bannerDescription}</p>
                        </div>
                    )}
                    <main className="main-content">
                        {children}
                    </main>
                </SemanticSidebar.Pusher>
            </SemanticSidebar.Pushable>
            <Footer />
        </div>
    );
};

export default Layout;
