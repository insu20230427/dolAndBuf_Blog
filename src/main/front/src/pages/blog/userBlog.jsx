import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBlog } from '../../contexts/blogContext';

function UserBlog() {
    const { blogName } = useParams();
    const { setBlogName } = useBlog();
    const navigate = useNavigate();

    useEffect(() => {

        if (blogName) {
            setBlogName(blogName);
        }

        navigate('/posts/all');

    }, [blogName, setBlogName]);

}

export default UserBlog;