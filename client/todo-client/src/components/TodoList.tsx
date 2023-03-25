import React, { useEffect, useState } from "react";
import {
    Box,
    Input,
    Button,
    VStack,
    HStack,
    Spinner,
    useToast,
} from "@chakra-ui/react";
import useTodos from "../hooks/useTodos";
import TodoItem from "./TodoItem";

const TodoList: React.FC = () => {
    const { todos, loading, error, addTodo, removeTodo, updateTodoCompletion } =
        useTodos();
    const [inputValue, setInputValue] = useState("");
    const toast = useToast();

    const handleAddTodo = (event: React.FormEvent) => {
        event.preventDefault();
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
                    <form onSubmit={handleAddTodo}>
                        <HStack>
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Enter a todo"
                            />
                            <Button type="submit" colorScheme="blue">
                                Add
                            </Button>
                        </HStack>
                    </form>
                    {todos.map((todo) => (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            updateTodoCompletion={updateTodoCompletion}
                            removeTodo={removeTodo}
                        />
                    ))}
                </VStack>
            )}
        </Box>
    );
};

export default TodoList;
