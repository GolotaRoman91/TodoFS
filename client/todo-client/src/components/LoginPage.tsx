import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Heading,
    useToast,
} from "@chakra-ui/react";
import useAuth from "../hooks/useAuth";

const AuthPage = () => {
    const { isLogin, setIsLogin, loginUser, registerUser } = useAuth();
    const toast = useToast();

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const email = event.currentTarget.email.value;
        const password = event.currentTarget.password.value;

        try {
            await loginUser({ login: email, password });
            toast({
                title: "Успешный вход",
                description: "Вы успешно вошли в систему",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Ошибка входа",
                description: (error as Error).message,
                status: "error",
                isClosable: true,
            });
        }
    };

    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const email = event.currentTarget.email.value;
        const password = event.currentTarget.password.value;

        try {
            await registerUser({ login: email, password });
            toast({
                title: "Успешная регистрация",
                description: "Вы успешно зарегистрировались",
                status: "success",
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Ошибка входа",
                description: (error as Error).message,
                status: "error",
                isClosable: true,
            });
        }
    };

    return (
        <Box maxWidth="md" mx="auto">
            <Heading textAlign="center" my={12}>
                {isLogin ? "Войти" : "Регистрация"}
            </Heading>
            <Box bg="gray.100" py={5} px={8} borderRadius="lg">
                <form onSubmit={isLogin ? handleLogin : handleRegister}>
                    <Stack spacing={3}>
                        <FormControl>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                autoComplete="email"
                                isRequired
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Пароль</FormLabel>
                            <Input
                                type="password"
                                id="password"
                                name="password"
                                autoComplete="current-password"
                                isRequired
                            />
                        </FormControl>
                        <Button type="submit" colorScheme="blue" width="full">
                            {isLogin ? "Войти" : "Зарегистрироваться"}
                        </Button>
                    </Stack>
                </form>
            </Box>
            <Button
                onClick={() => setIsLogin(!isLogin)}
                variant="link"
                colorScheme="blue"
                mt={4}
            >
                {isLogin
                    ? "У вас нет аккаунта? Зарегистрироваться"
                    : "Уже зарегистрированы? Войти"}
            </Button>
        </Box>
    );
};

export default AuthPage;
