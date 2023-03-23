import { useNavigate } from "react-router-dom";
import { Box, Text, Button, Flex } from "@chakra-ui/react";
import TodoList from "./TodoList";

const MainPage = () => {
    const navigate = useNavigate();
    const userEmail = localStorage.getItem("user_email") || "Unknown user";

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_email");
        navigate("/login");
    };

    return (
        <Box>
            <Flex
                as="header"
                justifyContent="flex-end"
                alignItems="center"
                padding="10px 20px"
                backgroundColor="gray.100"
                borderBottom="1px solid"
                borderColor="gray.200"
            >
                <Flex alignItems="center">
                    <Text>{userEmail}</Text>
                    <Button
                        onClick={handleLogout}
                        ml={4}
                        colorScheme="red"
                        variant="solid"
                    >
                        Logout
                    </Button>
                </Flex>
            </Flex>
            <TodoList />
        </Box>
    );
};

export default MainPage;
