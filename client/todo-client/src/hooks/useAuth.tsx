import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/loginUser";
import { registerUser } from "../services/registerUser";

type Credentials = {
    login: string;
    password: string;
};

const useAuth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const wrappedLoginUser = async (
        credentials: Credentials,
        email: string
    ) => {
        await loginUser(credentials, email, navigate);
    };

    return {
        isLogin,
        setIsLogin,
        loginUser: wrappedLoginUser,
        registerUser,
    };
};

export default useAuth;
