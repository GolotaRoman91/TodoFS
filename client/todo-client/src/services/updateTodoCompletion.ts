import { Dispatch, SetStateAction } from "react";
import { Todo } from "../types/Todo";

const updateTodoCompletion = async (
    todos: Todo[],
    setTodos: Dispatch<SetStateAction<Todo[]>>,
    setError: (error: Error | null) => void,
    id: number,
    completed: boolean
) => {
    const token = localStorage.getItem("access_token");

    if (!token) {
        setError(new Error("User is not authenticated"));
        return;
    }

    const todoToUpdate = todos.find((todo) => todo.id === id);
    if (!todoToUpdate) {
        setError(new Error("Todo not found"));
        return;
    }

    const updatedTodoData = {
        ...todoToUpdate,
        completed,
    };

    try {
        const response = await fetch(`http://localhost:3333/todos/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedTodoData),
        });

        if (!response.ok) {
            throw new Error("Failed to update todo");
        }

        const updatedTodo = await response.json();

        setTodos((prevTodos) =>
            prevTodos.map((todo) =>
                todo.id === updatedTodo.id ? updatedTodo : todo
            )
        );
    } catch (err) {
        setError(err as Error);
    }
};

export default updateTodoCompletion;
