import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Index from "./component";
import Login from "./component/login";
import Signup from "./component/signup";
import WritePost from "./component/writePost";
import DetailPost from "./component/detailPost";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/signup" element={<Signup/>}/>
                    <Route path="/" element={<Index/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/write" element={<WritePost/>}/>
                    <Route path="/detail-post/:id" element={<DetailPost/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;