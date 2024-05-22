import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Footer from '../components/footer';
import Header from '../components/header';
import Sidebar from '../components/sidebar';
import { useBlog } from '../contexts/blogContext';

const Layout = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const { blogName } = useBlog();

    useEffect(() => {
        if (blogName) {
            const fetchUserId = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/blogs?blogName=${blogName}`);
                    console.log(response.data.data);
                    setUserId(response.data.data);
                } catch (error) {
                    console.error('Failed to fetch user ID:', error);
                }
            };
    
            fetchUserId();
        }
    }, [blogName]);

    return (
        <div>
            <Header />
            <div style={{ display: 'flex' }}>
                {blogName && (
                    <div style={{ width: '200px' }}>
                        {userId && <Sidebar userId={userId} />}
                    </div>
                )}
                <main style={{ flex: 1 }}>
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default Layout;