import { Route, Routes, Link, BrowserRouter } from "react-router-dom";
import HomePage from "./components/MainPage";
import LoginPage from "./components/LoginPage";
import MainPage from "./components/MainPage";
import PrivateRoutes from "./utils/PrivateRoute";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PrivateRoutes />}>
                    <Route path="/main" element={<MainPage />} />
                </Route>
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
