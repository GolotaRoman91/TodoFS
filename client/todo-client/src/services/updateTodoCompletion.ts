import { Todo } from "../types/Todo";

async function updateTodoCompletion(
    todos: Todo[],
    id: number,
    completed: boolean
): Promise<{ updatedTodos?: Todo[]; error?: Error; loading: boolean }> {
    let updatedTodos: Todo[] | undefined;
    let error: Error | undefined;
    let loading = true;

    const token = localStorage.getItem("access_token");
    if (!token) {
        error = new Error("User is not authenticated");
        loading = false;
        return { error, loading };
    }

    const todoToUpdate = todos.find((todo) => todo.id === id);
    if (!todoToUpdate) {
        error = new Error("Todo not found");
        loading = false;
        return { error, loading };
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
        updatedTodos = todos.map((todo) =>
            todo.id === updatedTodo.id ? updatedTodo : todo
        );
    } catch (err) {
        error = err as Error;
    } finally {
        loading = false;
    }

    return { updatedTodos, error, loading };
}

export default updateTodoCompletion;
