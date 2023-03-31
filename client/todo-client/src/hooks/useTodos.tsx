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
        const { updatedTodos, error, loading } = await updateTodoCompletion(
            todos,
            id,
            completed
        );

        if (updatedTodos) {
            setTodos(updatedTodos);
        }

        setError(error as Error);
        setLoading(loading);
    };

    const wrappedRemoveTodo = async (id: number) => {
        const { removedTodoId, error, loading } = await removeTodo(id);

        if (removedTodoId !== undefined) {
            setTodos((prevTodos) =>
                prevTodos.filter((todo) => todo.id !== removedTodoId)
            );
        }

        setError(error as Error);
        setLoading(loading);
    };

    const wrappedAddTodo = async (title: string, description: string) => {
        const { newTodo, error, loading } = await addTodo({
            title,
            description,
        });

        if (newTodo) {
            setTodos((prevTodos) => [...prevTodos, newTodo]);
        }

        setError(error as Error);
        setLoading(loading);
    };

    useEffect(() => {
        const fetchAndSetTodos = async () => {
            setLoading(true);
            const { data, error, loading } = await fetchTodos();

            if (data) {
                setTodos(data);
            }

            if (error) {
                setError(error as Error);
            }

            setLoading(loading);
        };

        fetchAndSetTodos();
    }, []);

    return {
        todos,
        error,
        loading,
        setTodos,
        updateTodoCompletion: wrappedUpdateTodoCompletion,
        removeTodo: wrappedRemoveTodo,
        addTodo: wrappedAddTodo,
    };
};

export default useTodos;
