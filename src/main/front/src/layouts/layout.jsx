import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import Footer from '../components/footer';
import Header from '../components/header';
import Sidebar from '../components/sidebar';
import { useBlog } from '../contexts/blogContext';
import { Button, Input, Sidebar as SemanticSidebar } from 'semantic-ui-react';
import './layout.css';
import Cookies from 'js-cookie';
import YouTubePlayer from 'youtube-player';

const Layout = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [playlistInput, setPlaylistInput] = useState('');
    const [currentPlaylistId, setCurrentPlaylistId] = useState('');
    const playerRef = useRef(null);
    const iframeContainerRef = useRef(null);
    const [volume, setVolume] = useState(50);
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
                    if (blogName === '') return;
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

    return (
        <div className="layout">
            <Header isSidebarVisible={sidebarVisible} />
            <SemanticSidebar.Pushable>
                <Sidebar userId={userId} visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
                <SemanticSidebar.Pusher>
                    {blogName === '' ? (
                        <div className="banner">
                            <h1>Welcome to the Blog!</h1>
                            <p>Please register or log in to enjoy exciting blog activities.</p>
                        </div>
                    ) : bannerInfo.username === blogName && bannerInfo.bannerImageUrl && bannerInfo.bannerDescription ? (
                        <div className="banner">
                            <h1>{blogName} Blog</h1>
                            <img src={bannerInfo.bannerImageUrl} alt="Banner" />
                            <p>{bannerInfo.bannerDescription}</p>
                        </div>
                    ) : (
                        <div className="banner">
                            <h1>{blogName} Blog</h1>
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
