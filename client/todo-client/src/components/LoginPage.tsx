import React from "react";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Heading,
} from "@chakra-ui/react";

interface LoginPageProps {
    email: string;
    password: string;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    handleLogin: (event: React.FormEvent<HTMLFormElement>) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({
    email,
    password,
    setEmail,
    setPassword,
    handleLogin,
}) => {
    return (
        <Box maxWidth="md" mx="auto">
            <Heading textAlign="center" my={12}>
                Login
            </Heading>
            <Box bg="gray.100" py={5} px={8} borderRadius="lg">
                <form onSubmit={handleLogin}>
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
                            Login
                        </Button>
                    </Stack>
                </form>
            </Box>
        </Box>
    );
};

export default LoginPage;
