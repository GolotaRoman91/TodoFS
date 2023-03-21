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

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const toast = useToast();

    const loginUser = async (email: string, password: string) => {
        try {
            const response = await fetch("http://localhost:3333/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    login: email,
                    password: password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Токен:", data.access_token);
                // Здесь вы можете сохранить токен, например, в localStorage или используя другой метод хранения
                localStorage.setItem("access_token", data.access_token);
                toast({
                    title: "Успешный вход",
                    description: "Вы успешно вошли в систему",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                const error = await response.json();
                throw new Error(error.message || "Не удалось выполнить вход");
            }
        } catch (error: unknown) {
            let errorMessage: string;

            if (error instanceof Error) {
                errorMessage = error.message;
            } else {
                errorMessage = "Неизвестная ошибка";
            }

            toast({
                title: "Ошибка входа",
                description: errorMessage,
                status: "error",
                // duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const email = event.currentTarget.email.value;
        const password = event.currentTarget.password.value;

        if (isLogin) {
            loginUser(email, password);
        } else {
            try {
                const response = await fetch(
                    "http://localhost:3333/auth/register",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            login: event.currentTarget.email.value,
                            password: event.currentTarget.password.value,
                        }),
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    toast({
                        title: "Успешная регистрация",
                        description: "Вы успешно зарегистрировались",
                        status: "success",
                        // duration: 3000,
                        isClosable: true,
                    });
                } else {
                    toast({
                        title: "Ошибка регистрации",
                        description: data.message || "Что-то пошло не так",
                        status: "error",
                        // duration: 3000,
                        isClosable: true,
                    });
                }
            } catch (error) {
                toast({
                    title: "Ошибка регистрации",
                    description: "Что-то пошло не так",
                    status: "error",
                    // duration: 3000,
                    isClosable: true,
                });
            }
        }
    };

    return (
        <Box maxWidth="md" mx="auto">
            <Heading textAlign="center" my={12}>
                {isLogin ? "Войти" : "Регистрация"}
            </Heading>
            <Box bg="gray.100" py={5} px={8} borderRadius="lg">
                <form onSubmit={handleSubmit}>
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
