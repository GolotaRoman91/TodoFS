import { NavigateFunction } from "react-router-dom";

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

export const loginUser = async (
    { login, password }: Credentials,
    email: string,
    navigate: NavigateFunction
) => {
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
            localStorage.setItem("user_email", email);
            console.log("Token:", data.access_token);
            navigate("/main");
        } else {
            const error: ErrorResponse = await response.json();
            throw new Error(error.message || "Failed to log in");
        }
    } catch (error: unknown) {
        let errorMessage: string;

        if (error instanceof Error) {
            errorMessage = error.message;
        } else {
            errorMessage = "Unknown error";
        }

        throw new Error(errorMessage);
    }
};
