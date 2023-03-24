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

    const removeTodo = async (id: number) => {
        setLoading(true);
        const token = localStorage.getItem("access_token");

        if (!token) {
            setError(new Error("User is not authenticated"));
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:3333/todos/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to remove todo");
            }

            setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    const addTodo = async (title: string, description: string) => {
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
