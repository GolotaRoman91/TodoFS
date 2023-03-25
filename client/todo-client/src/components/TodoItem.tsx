import React from "react";
import { Todo } from "../types/Todo";
import { HStack, Checkbox, Text, Button } from "@chakra-ui/react";

type TodoItemProps = {
    todo: Todo;
    updateTodoCompletion: (id: number, completed: boolean) => void;
    removeTodo: (id: number) => void;
};

const TodoItem: React.FC<TodoItemProps> = ({
    todo,
    updateTodoCompletion,
    removeTodo,
}) => {
    return (
        <HStack key={todo.id} w="100%" justifyContent="space-between">
            <Checkbox
                isChecked={todo.completed}
                onChange={() => updateTodoCompletion(todo.id, !todo.completed)}
            />
            <Text
                textDecoration={todo.completed ? "line-through" : "none"}
                transition="text-decoration 0.5s"
            >
                {todo.title}
            </Text>
            <Button onClick={() => removeTodo(todo.id)} colorScheme="red">
                Remove
            </Button>
        </HStack>
    );
};

export default TodoItem;