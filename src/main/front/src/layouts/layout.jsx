import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, Sidebar as SemanticSidebar } from 'semantic-ui-react';
import YouTubePlayer from 'youtube-player';
import Footer from '../components/footer';
import Header from '../components/header';
import Sidebar from '../components/sidebar';
import { useBlog } from '../contexts/blogContext';
import { Sidebar as SemanticSidebar } from 'semantic-ui-react';
import './layout.css';

const Layout = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [playlistInput, setPlaylistInput] = useState('');
    const [currentPlaylistId, setCurrentPlaylistId] = useState('');
    const { blogName } = useBlog();
    const playerRef = useRef(null);
    const iframeContainerRef = useRef(null);
    const [volume, setVolume] = useState(50);

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
                                <Button  icon='stop' size='tiny' onClick={handleStop}/>
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
