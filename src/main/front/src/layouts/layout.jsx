import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useRef, useState } from 'react';
import { Sidebar as SemanticSidebar } from 'semantic-ui-react';
import Footer from '../components/footer';
import Header from '../components/header';
import Sidebar from '../components/sidebar';
import { useBlog } from '../contexts/blogContext';
import { Button, Input, Sidebar as SemanticSidebar } from 'semantic-ui-react';
import './layout.css';
import Cookies from 'js-cookie';
import YouTubePlayer from 'youtube-player';
import Chat from '../pages/chat/chat';
import ChatApp from '../pages/chat/chatApp';

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

    useEffect(() => {
        if (iframeContainerRef.current && currentPlaylistId) {
            playerRef.current = YouTubePlayer(iframeContainerRef.current, {
                playerVars: {
                    listType: 'playlist',
                    list: currentPlaylistId,
                    autoplay: 1,
                    loop: 1,
                    mute: 0
                },
            });
            playerRef.current.on('ready', () => {
                playerRef.current.setVolume(volume);
            });
        }
    }, [currentPlaylistId]);

    const handleSidebarToggle = () => {
        setSidebarVisible(!sidebarVisible);
    };

    const handlePlaylistChange = (e) => {
        setPlaylistInput(e.target.value);
    };

    const handlePlayMusic = async () => {
        const playlistId = extractPlaylistId(playlistInput);

        if (playlistId) {
            setCurrentPlaylistId(playlistId);
        } else {
            const searchId = await fetchPlaylistIdByTitle(playlistInput);
            if (searchId) {
                setCurrentPlaylistId(searchId);
            } else {
                alert("Playlist not found. Please check the title or URL and try again.");
            }
        }
    };

    const extractPlaylistId = (input) => {
        const urlPattern = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:playlist\?list=|watch\?v=[^&]+&list=)([A-Za-z0-9_-]+)/;
        const match = input.match(urlPattern);
        if (match && match[1]) {
            return match[1];
        }
        return null;
    };

    const fetchPlaylistIdByTitle = async (title) => {
        try {
            const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
                params: {
                    part: 'snippet',
                    q: title,
                    type: 'playlist',
                    key: 'AIzaSyB6DQycBeJ68mN5Jme6uQtF6t3jyXroa2k'
                }
            });
            if (response.data.items.length > 0) {
                return response.data.items[0].id.playlistId;
            }
        } catch (error) {
            console.error('Failed to fetch playlist ID by title:', error);
        }
        return null;
    };

    const handlePause = () => {
        if (playerRef.current) {
            playerRef.current.pauseVideo();
        }
    };

    const handleStop = () => {
        if (playerRef.current) {
            playerRef.current.stopVideo();
            playerRef.current.destroy();
            playerRef.current = null;
            setCurrentPlaylistId('');
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = e.target.value;
        setVolume(newVolume);
        if (playerRef.current) {
            playerRef.current.setVolume(newVolume);
        }
    };

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
                    {Cookies.get('Authorization') &&
                        <ChatApp />
                    }
                    {children}
                        {children}
                        <div className="toolbar">
                            <div className="player-controls">
                                <div className="input-container">
                                    <Input
                                        placeholder="Enter YouTube Playlist URL or Title"
                                        value={playlistInput}
                                        onChange={handlePlaylistChange}
                                    />
                                    <Button icon='play' size='tiny' onClick={handlePlayMusic}/>
                                </div>
                                <Button icon='pause' size='tiny' onClick={handlePause}/>
                                <Button icon='stop' size='tiny' onClick={handleStop}/>
                                <div className="volume-control">
                                    <label>Volume: </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={volume}
                                        onChange={handleVolumeChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </main>
                </SemanticSidebar.Pusher>
            </SemanticSidebar.Pushable>
            <Footer/>
            {currentPlaylistId && (
                <div style={{ display: 'none' }} ref={iframeContainerRef}></div>
            )}
        </div>
    );
};

export default Layout;
