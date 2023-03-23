import { useState, useEffect } from "react";

type Todo = {
    id: number;
    userId: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        email: string;
        passwordHash: string;
        createdAt: string;
        updatedAt: string;
    };
};

const useTodos = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchTodos = async () => {
        setLoading(true);
        const token = localStorage.getItem("access_token");

        if (!token) {
            setError(new Error("User is not authenticated"));
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:3333/todos", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch todos");
            }

            const data = await response.json();
            setTodos(data);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    const updateTodoCompletion = async (id: number, completed: boolean) => {
        // Implement update logic here
    };

    const removeTodo = async (id: number) => {
        // Implement delete logic here
    };

    const addTodo = async (title: string, description: string) => {
        // Implement create logic here
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    return {
        todos,
        error,
        loading,
        updateTodoCompletion,
        removeTodo,
        addTodo,
    };
};

export default useTodos;
