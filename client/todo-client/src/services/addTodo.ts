import { Todo } from "../types/Todo";

interface AddTodoOptions {
    title: string;
    description: string;
}

async function addTodo({
    title,
    description,
}: AddTodoOptions): Promise<{
    newTodo?: Todo;
    error?: Error;
    loading: boolean;
}> {
    let newTodo: Todo | undefined;
    let error: Error | undefined;
    let loading = true;

    const token = localStorage.getItem("access_token");
    if (!token) {
        error = new Error("User is not authenticated");
        loading = false;
        return { error, loading };
    }

    try {
        const response = await fetch("http://localhost:3333/todos", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                description,
                completed: false,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to add todo");
        }

        newTodo = await response.json();
    } catch (err) {
        error = err as Error;
    } finally {
        loading = false;
    }

    return { newTodo, error, loading };
}

export default addTodo;
