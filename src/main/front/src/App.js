import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { BlogProvider } from './contexts/blogContext';
import Layout from './layouts/layout';
import UserBlog from './pages/blog/userBlog';
import CategoryPosts from './pages/category/categoryPosts';
import Chat from './pages/chat/chat';
import ChatApp from './pages/chat/chatApp';
import Index from './pages/index';
import Login from './pages/login/login';
import DetailPost from './pages/posts/detailPost/detailPost';
import SearchPost from './pages/posts/searchPost/searchPost';
import UpdatePost from './pages/posts/updatePost/updatePost';
import WritePost from './pages/posts/writePost/writePost';
import Signup from './pages/signup/signup';
import User from './pages/user/user';

function App() {
    return (
        <BrowserRouter>
            <BlogProvider>
            <Layout>
                <Routes>
                    <Route path="/" exact element={<Index/>}/>
                    <Route path="/signup" element={<Signup/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/user" element={<User/>}/>
                    <Route path="/detail-post/:id" element={<DetailPost/>}/>
                    <Route path="/write" element={<WritePost/>}/>
                    <Route path="/update-post/:id" element={<UpdatePost/>}/>
                    <Route path="/search-post" element={<SearchPost/>}/>
                    <Route path="/posts/:categoryId" element={<CategoryPosts/>}/>
                    <Route path="/blog/:blogName" element={<UserBlog/>}/>
                    <Route path="/chat" element={<ChatApp/>}/>
                    <Route path="/room/:roomId/:chatRoomName" element={<Chat/>}/>
                </Routes>
            </Layout>
            </BlogProvider>
        </BrowserRouter>
    );
}

export default App;
