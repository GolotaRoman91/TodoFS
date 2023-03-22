import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Credentials = {
    login: string;
    password: string;
};

type AuthResponse = {
    access_token: string;
};

type ErrorResponse = {
    message: string;
};

const useAuth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const loginUser = async ({ login, password }: Credentials) => {
        try {
            const response = await fetch("http://localhost:3333/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    login,
                    password,
                }),
            });

            if (response.ok) {
                const data: AuthResponse = await response.json();
                localStorage.setItem("access_token", data.access_token);
                console.log("Токен:", data.access_token);
                navigate("/main");
            } else {
                const error: ErrorResponse = await response.json();
                throw new Error(error.message || "Не удалось выполнить вход");
            }
        } catch (error: unknown) {
            let errorMessage: string;

            if (error instanceof Error) {
                errorMessage = error.message;
            } else {
                errorMessage = "Неизвестная ошибка";
            }

            throw new Error(errorMessage);
        }
    };

    const registerUser = async ({ login, password }: Credentials) => {
        try {
            const response = await fetch(
                "http://localhost:3333/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        login,
                        password,
                    }),
                }
            );

            if (response.ok) {
                console.log("Регистрация прошла успешно");
            } else {
                const error: ErrorResponse = await response.json();
                throw new Error(
                    error.message || "Не удалось зарегистрироваться"
                );
            }
        } catch (error: unknown) {
            let errorMessage: string;

            if (error instanceof Error) {
                errorMessage = error.message;
            } else {
                errorMessage = "Неизвестная ошибка";
            }

            throw new Error(errorMessage);
        }
    };

    return {
        isLogin,
        setIsLogin,
        loginUser,
        registerUser,
    };
};

export default useAuth;
