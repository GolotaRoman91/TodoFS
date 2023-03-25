import { Dispatch, SetStateAction } from "react";
import { Todo } from "../types/Todo";

const removeTodo = (
    setTodos: Dispatch<SetStateAction<Todo[]>>,
    setError: (error: Error | null) => void,
    setLoading: (loading: boolean) => void,
    id: number
) => {
    setLoading(true);
    const token = localStorage.getItem("access_token");

    if (!token) {
        setError(new Error("User is not authenticated"));
        setLoading(false);
        return;
    }

    fetch(`http://localhost:3333/todos/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to remove todo");
            }
            setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
        })
        .catch((err) => setError(err as Error))
        .finally(() => setLoading(false));
};

export default removeTodo;
