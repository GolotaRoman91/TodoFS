import React, { useEffect, useState } from "react";
import {
    Box,
    Input,
    Button,
    VStack,
    HStack,
    Text,
    Checkbox,
    Spinner,
    useToast,
} from "@chakra-ui/react";
import useTodos from "../hooks/useTodos";

const TodoList: React.FC = () => {
    const { todos, loading, error, addTodo, removeTodo, updateTodoCompletion } =
        useTodos();
    const [inputValue, setInputValue] = useState("");
    const toast = useToast();

    const handleAddTodo = () => {
        if (inputValue) {
            addTodo(inputValue, "");
            setInputValue("");
        }
    };

    useEffect(() => {
        if (error) {
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                isClosable: true,
            });
        }
    }, [error, toast]);

    return (
        <Box mt={8} mx="auto" maxWidth="md">
            {loading ? (
                <Spinner />
            ) : (
                <VStack spacing={4}>
                    <HStack>
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Enter a todo"
                        />
                        <Button onClick={handleAddTodo} colorScheme="blue">
                            Add
                        </Button>
                    </HStack>
                    {todos.map((todo) => (
                        <HStack
                            key={todo.id}
                            w="100%"
                            justifyContent="space-between"
                        >
                            <Checkbox
                                isChecked={todo.completed}
                                onChange={() =>
                                    updateTodoCompletion(
                                        todo.id,
                                        !todo.completed
                                    )
                                }
                            />
                            <Text
                                textDecoration={
                                    todo.completed ? "line-through" : "none"
                                }
                                transition="text-decoration 0.5s"
                            >
                                {todo.title}
                            </Text>
                            <Button
                                onClick={() => removeTodo(todo.id)}
                                colorScheme="red"
                            >
                                Remove
                            </Button>
                        </HStack>
                    ))}
                </VStack>
            )}
        </Box>
    );
};

export default TodoList;
