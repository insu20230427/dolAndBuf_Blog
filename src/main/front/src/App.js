import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { BlogProvider } from './contexts/blogContext';
import Layout from './layouts/layout';
import UserBlog from './pages/blog/userBlog';
import CategoryPosts from './pages/category/categoryPosts';
import CategorySetting from './pages/category/categorySetting';
import Chat from './pages/chat/chat';
import ChatApp from './pages/chat/chatApp';
import Index from './pages/index';
import LoginAndSignUp from '../../front/src/pages/login/LoginAndSignUp';
import DetailPost from './pages/posts/detailPost/detailPost';
import SearchPost from './pages/posts/searchPost/searchPost';
import UpdatePost from './pages/posts/updatePost/updatePost';
import WritePost from './pages/posts/writePost/writePost';
import Signup from './pages/signup/signup';
import User from './pages/user/user';
import GameBoard from './game/GameBoard';
import Header from './components/header';
import Footer from './components/footer';
import FindIdAndPasswordModal from './components/FindIdAndPasswordModal';

function App() {
    return (
        <BrowserRouter>
            <BlogProvider>
                <AppRoutes />
            </BlogProvider>
        </BrowserRouter>
    );
}

function AppRoutes() {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';
    const isFindPage = location.pathname === '/find';

    if (isLoginPage) {
        return (
            <>
                <Header />
                <Routes>
                    <Route path="/login" element={<LoginAndSignUp />} />
                </Routes>
                <Footer />
            </>
        );
    }

    if (isFindPage) {
        return (
            <>
                <Header />
                <Routes>
                    <Route path="/find" element={<FindIdAndPasswordModal />} />
                </Routes>
                <Footer />
            </>
        );
    }

    return (
        <Layout>
            <Routes>
                <Route path="/" exact element={<Index />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/user" element={<User />} />
                <Route path="/detail-post/:id" element={<DetailPost />} />
                <Route path="/write" element={<WritePost />} />
                <Route path="/update-post/:id" element={<UpdatePost />} />
                <Route path="/search-post" element={<SearchPost />} />
                <Route path="/posts/:categoryId" element={<CategoryPosts />} />
                <Route path="/blog/:blogName" element={<UserBlog />} />
                <Route path="/chat" element={<ChatApp />} />
                <Route path="/room/:roomId/:chatRoomName" element={<Chat />} />
                <Route path="/category-setting" element={<CategorySetting />} />
                <Route path="/game-board" element={<GameBoard />} />
            </Routes>
        </Layout>
    );
}

export default App;
