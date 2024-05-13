import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Index from "./component";
import Login from "./component/login";
import Signup from "./component/signup";
import WritePost from "./component/writePost";
import User from "./component/user";
import UpdatePost from "./component/updatePost";
import DetailPost from "./component/detailPost";
import {Header} from "semantic-ui-react";
import Footer from "./component/footer";

function App() {
    return (
        <>
            <div className="App">
                <BrowserRouter>
                    <Routes>
                        <Route path="/signup" element={<Signup/>}/>
                        <Route path="/" element={<Index/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/write" element={<WritePost/>}/>
                        <Route path="/detail-post/:id" element={<DetailPost/>}/>
                        <Route path="/user" element={<User/>}/>
                        <Route path="/update-post/:id" element={<UpdatePost/>}/>
                        <Route path="/searchPost" element={<SearchPost />}/>
                    </Routes>
                </BrowserRouter>
            </div>
        </>
    );
}

export default App;
