import { Dispatch, SetStateAction } from "react";
import { Todo } from "../types/Todo";

const addTodo = async (
    setTodos: Dispatch<SetStateAction<Todo[]>>,
    setError: (error: Error | null) => void,
    setLoading: (loading: boolean) => void,
    title: string,
    description: string
) => {
    setLoading(true);
    const token = localStorage.getItem("access_token");

    if (!token) {
        setError(new Error("User is not authenticated"));
        setLoading(false);
        return;
    }

    try {
        const response = await fetch("http://localhost:3333/todos", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: title,
                description: description,
                completed: false,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to add todo");
        }

        const newTodo = await response.json();
        setTodos((prevTodos) => [...prevTodos, newTodo]);
    } catch (err) {
        setError(err as Error);
    } finally {
        setLoading(false);
    }
};

export default addTodo;
