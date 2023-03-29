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

interface RegisterPageProps {
    email: string;
    password: string;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    handleRegister: (event: React.FormEvent<HTMLFormElement>) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({
    email,
    password,
    setEmail,
    setPassword,
    handleRegister,
}) => {
    return (
        <Box maxWidth="md" mx="auto">
            <Heading textAlign="center" my={12}>
                Register
            </Heading>
            <Box bg="gray.100" py={5} px={8} borderRadius="lg">
                <form onSubmit={handleRegister}>
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
                            Register
                        </Button>
                    </Stack>
                </form>
            </Box>
        </Box>
    );
};

export default RegisterPage;
