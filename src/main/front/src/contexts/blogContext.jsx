import React, { createContext, useContext, useState } from 'react';

const BlogContext = createContext();

export const useBlog = () => useContext(BlogContext);

export const BlogProvider = ({ children }) => {
    const [blogName, setBlogName] = useState('');

    return (
        <BlogContext.Provider value={{ blogName, setBlogName }}>
            {children}
        </BlogContext.Provider>
    );
};