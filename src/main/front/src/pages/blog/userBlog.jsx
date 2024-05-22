import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBlog } from '../../contexts/blogContext';

function UserBlog() {
    const { blogName } = useParams();
    const { setBlogName } = useBlog();
    const [blogPosts, setBlogPosts] = useState([]);

    useEffect(() => {

        if (blogName) {
            setBlogName(blogName);
          }
          
        const fetchBlogPosts = async () => {
            try { // 블로그 정보 가져오기 - back에서 매서드추가 및 수정필요
                // const response = await axios.get(`http://localhost:8080/blogs?blogName=${blogName}`);
                // console.log(response.data);
                // setBlogPosts(response.data);
            } catch (error) {
                console.error('Error fetching blog posts:', error);
            }
        };

        fetchBlogPosts();
    }, [blogName, setBlogName]);

    return (
        <div>
            <h1>{blogName}'s Blog</h1>
            {blogPosts.map(post => (
                <div key={post.id}>
                    <h2>{post.title}</h2>
                    <p>{post.content}</p>
                </div>
            ))}
        </div>
    );
}

export default UserBlog;