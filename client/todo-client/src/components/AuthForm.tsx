import React from "react";
import {
    FormControl,
    FormLabel,
    Input,
    Button,
    Stack,
    Text,
    Box,
} from "@chakra-ui/react";

interface FormProps {
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    buttonText: string;
}

const AuthForm: React.FC<FormProps> = ({ onSubmit, buttonText }) => {
    return (
        <form onSubmit={onSubmit}>
            <Stack spacing={3}>
                <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        autoComplete="email"
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Пароль</FormLabel>
                    <Input
                        type="password"
                        id="password"
                        name="password"
                        autoComplete="current-password"
                    />
                </FormControl>
                <Button type="submit" colorScheme="blue" width="full">
                    {buttonText}
                </Button>
            </Stack>
        </form>
    );
};

const LoginForm: React.FC<FormProps> = ({ onSubmit, buttonText }) => {
    return (
        <Box>
            <AuthForm onSubmit={onSubmit} buttonText={buttonText} />
            <Text textAlign="center" mt={4}>
                <a href="#">Забыли пароль?</a>
            </Text>
        </Box>
    );
};

const RegistrationForm: React.FC<FormProps> = ({ onSubmit, buttonText }) => {
    return <AuthForm onSubmit={onSubmit} buttonText={buttonText} />;
};

export { LoginForm, RegistrationForm };
