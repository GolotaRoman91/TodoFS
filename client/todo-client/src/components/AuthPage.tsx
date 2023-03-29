import React, { useState } from "react";
import { Button, Box, useToast } from "@chakra-ui/react";
import useAuth from "../hooks/useAuth";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";

const AuthPage = () => {
    const { isLogin, setIsLogin, loginUser, registerUser } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const toast = useToast();

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await loginUser({ login: email, password }, email);
            toast({
                title: "Login successful",
                description: "You have successfully logged in",
                status: "success",
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Login error",
                description: (error as Error).message,
                status: "error",
                isClosable: true,
            });
        }
    };

    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await registerUser({ login: email, password });
            toast({
                title: "Registration successful",
                description: "You have successfully registered",
                status: "success",
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Registration error",
                description: (error as Error).message,
                status: "error",
                isClosable: true,
            });
        }
    };

    const handleToggleAuth = () => {
        setIsLogin(!isLogin);
        setEmail("");
        setPassword("");
    };

    return (
        <>
            {isLogin ? (
                <LoginPage
                    email={email}
                    password={password}
                    setEmail={setEmail}
                    setPassword={setPassword}
                    handleLogin={handleLogin}
                />
            ) : (
                <RegisterPage
                    email={email}
                    password={password}
                    setEmail={setEmail}
                    setPassword={setPassword}
                    handleRegister={handleRegister}
                />
            )}
            <Box textAlign="center" mt={4}>
                <Button
                    onClick={handleToggleAuth}
                    variant="link"
                    colorScheme="blue"
                >
                    {isLogin
                        ? "Don't have an account? Register"
                        : "Already registered? Login"}
                </Button>
            </Box>
        </>
    );
};

export default AuthPage;
