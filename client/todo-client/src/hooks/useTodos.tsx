import { useState, useEffect } from "react";
import addTodo from "../services/addTodo";
import fetchTodos from "../services/fetchTodos";
import removeTodo from "../services/removeTodo";
import updateTodoCompletion from "../services/updateTodoCompletion";
import { Todo } from "../types/Todo";

const useTodos = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(false);

    const wrappedUpdateTodoCompletion = async (
        id: number,
        completed: boolean
    ) => {
        await updateTodoCompletion(todos, setTodos, setError, id, completed);
    };

    const wrappedRemoveTodo = (id: number) => {
        removeTodo(setTodos, setError, setLoading, id);
    };

    const wrappedAddTodo = async (title: string, description: string) => {
        await addTodo(setTodos, setError, setLoading, title, description);
    };

    useEffect(() => {
        const fetchAndSetTodos = async () => {
            setLoading(true);
            const { data, error } = await fetchTodos();

            if (data) {
                setTodos(data);
            }

            if (error) {
                setError(error);
            }

            setLoading(false);
        };

        fetchAndSetTodos();
    }, []);

    return {
        todos,
        error,
        loading,
        updateTodoCompletion: wrappedUpdateTodoCompletion,
        removeTodo: wrappedRemoveTodo,
        addTodo: wrappedAddTodo,
    };
};

export default useTodos;
