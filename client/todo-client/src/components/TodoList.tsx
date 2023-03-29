import React, { useEffect } from "react";
import { Box, VStack, Spinner, useToast } from "@chakra-ui/react";
import useTodos from "../hooks/useTodos";
import TodoItem from "./TodoItem";
import AddTodoForm from "./AddTodoForm";

const TodoList: React.FC = () => {
    const { todos, loading, error, addTodo, removeTodo, updateTodoCompletion } =
        useTodos();
    const toast = useToast();

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
                    <AddTodoForm onAddTodo={addTodo} />
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
