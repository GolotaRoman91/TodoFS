import { Route, Routes, BrowserRouter } from "react-router-dom";
import MainPage from "./components/MainPage";
import PrivateRoutes from "./utils/PrivateRoute";
import AuthPage from "./components/AuthPage";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PrivateRoutes />}>
                    <Route path="/main" element={<MainPage />} />
                </Route>
                <Route path="/login" element={<AuthPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
