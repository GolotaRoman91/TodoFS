import React, { useState } from "react";
import {
    Box,
    Button,
    Heading,
    useToast,
    Text,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
} from "@chakra-ui/react";
import { LoginForm, RegistrationForm } from "./AuthForm";
import useAuth from "../hooks/useAuth";

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const toast = useToast();
    const { loginUser, registerUser } = useAuth();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const email = event.currentTarget.email.value;
        const password = event.currentTarget.password.value;

        if (isLogin) {
            try {
                await loginUser({ login: email, password });
                toast({
                    title: "Успешный вход",
                    description: "Вы успешно вошли в систему",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
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
                    isClosable: true,
                });
            }
        } else {
            try {
                await registerUser({ login: email, password });
                toast({
                    title: "Успешная регистрация",
                    description: "Вы успешно зарегистрировались",
                    status: "success",
                    isClosable: true,
                });
            } catch (error: unknown) {
                let errorMessage: string;

                if (error instanceof Error) {
                    errorMessage = error.message;
                } else {
                    errorMessage = "Неизвестная ошибка";
                }

                toast({
                    title: "Ошибка регистрации",
                    description: errorMessage,
                    status: "error",
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
            <Tabs
                variant="enclosed-colored"
                isFitted
                onChange={(index) => setIsLogin(index === 0)}
            >
                <TabList mb="1em">
                    <Tab>{isLogin ? "Вход" : "Регистрация"}</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        {isLogin ? (
                            <LoginForm
                                onSubmit={handleSubmit}
                                buttonText="Войти"
                            />
                        ) : (
                            <RegistrationForm
                                onSubmit={handleSubmit}
                                buttonText="Зарегистрироваться"
                            />
                        )}
                        <Text textAlign="center" mt={4}>
                            {isLogin ? (
                                <a href="#">Забыли пароль?</a>
                            ) : (
                                <Button
                                    variant="link"
                                    colorScheme="blue"
                                    onClick={() => setIsLogin(true)}
                                >
                                    Уже зарегистрированы? Войти
                                </Button>
                            )}
                        </Text>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
};

export default AuthPage;
