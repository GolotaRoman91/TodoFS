import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Heading,
    useToast,
    UseToastOptions,
} from "@chakra-ui/react";
import { useState } from "react";
import useAuth from "../hooks/useAuth";

const AuthPage = () => {
    const { isLogin, setIsLogin, loginUser, registerUser } = useAuth();
    const toast = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const showToast = (
        title: string,
        description: string,
        status: UseToastOptions["status"]
    ) => {
        toast({
            title,
            description,
            status,
            isClosable: true,
        });
    };

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            await loginUser({ login: email, password }, email);
            showToast(
                "Login successful",
                "You have successfully logged in",
                "success"
            );
        } catch (error) {
            showToast("Login error", (error as Error).message, "error");
        }
    };

    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            await registerUser({ login: email, password });
            showToast(
                "Registration successful",
                "You have successfully registered",
                "success"
            );
        } catch (error) {
            showToast("Registration error", (error as Error).message, "error");
        }
    };
    return (
        <Box maxWidth="md" mx="auto">
            <Heading textAlign="center" my={12}>
                {isLogin ? "Login" : "Register"}
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Password</FormLabel>
                            <Input
                                type="password"
                                id="password"
                                name="password"
                                autoComplete="current-password"
                                isRequired
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </FormControl>
                        <Button type="submit" colorScheme="blue" width="full">
                            {isLogin ? "Login" : "Register"}
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
                    ? "Don't have an account? Register"
                    : "Already registered? Login"}
            </Button>
        </Box>
    );
};

export default AuthPage;
