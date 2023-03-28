async function removeTodo(
    id: number
): Promise<{ removedTodoId?: number; error?: Error; loading: boolean }> {
    let removedTodoId: number | undefined;
    let error: Error | undefined;
    let loading = true;

    const token = localStorage.getItem("access_token");
    if (!token) {
        error = new Error("User is not authenticated");
        loading = false;
        return { error, loading };
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

        removedTodoId = id;
    } catch (err) {
        error = err as Error;
    } finally {
        loading = false;
    }

    return { removedTodoId, error, loading };
}

export default removeTodo;
