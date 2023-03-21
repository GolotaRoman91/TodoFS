import { Route, Routes, Link, BrowserRouter } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import MainPage from "./components/MainPage";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/main" element={<MainPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
