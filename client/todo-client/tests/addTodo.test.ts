import React from "react";
import { act } from "react-dom/test-utils";
import { renderHook } from "@testing-library/react-hooks";
import addTodo from "../src/services/addTodo";
import { Todo } from "../src/types/Todo";

// Мок для localStorage
const mockLocalStorage = () => {
    let store: { [key: string]: string } = {};

    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value;
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
};

describe("addTodo", () => {
    let todos: Todo[] = [];
    let error: Error | null = null;
    let loading: boolean = false;

    beforeEach(() => {
        // Настройка мока для localStorage
        Object.defineProperty(window, "localStorage", {
            value: mockLocalStorage(),
        });

        // Сброс значений перед каждым тестом
        todos = [];
        error = null;
        loading = false;
    });

    it("adds a new todo item", async () => {
        const setTodos: React.Dispatch<React.SetStateAction<Todo[]>> = (
            newTodos
        ) => {
            todos = newTodos as Todo[];
        };
        const setError = (newError: Error | null) => {
            error = newError;
        };
        const setLoading = (newLoading: boolean) => {
            loading = newLoading;
        };

        // Мок для fetch
        const mockSuccessResponse = {
            id: 1,
            title: "Test todo",
            description: "",
            completed: false,
        };
        const mockFetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockSuccessResponse),
        });
        global.fetch = mockFetch as any;

        // Задаем токен
        localStorage.setItem("access_token", "fake_token");

        await act(async () => {
            await addTodo(setTodos, setError, setLoading, "Test todo", "");
        });

        expect(loading).toBe(false);
        expect(error).toBeNull();
        expect(todos).toHaveLength(1);
        expect(todos[0]).toEqual(mockSuccessResponse);
        expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("handles error when adding a new todo item", async () => {
        const setTodos: React.Dispatch<React.SetStateAction<Todo[]>> = (
            newTodos
        ) => {
            todos = newTodos as Todo[];
        };
        const setError = (newError: Error | null) => {
            error = newError;
        };
        const setLoading = (newLoading: boolean) => {
            loading = newLoading;
        };

        // Мок для fetch
        const mockErrorResponse = { message: "Failed to add todo" };
        const mockFetch = jest.fn().mockResolvedValue({
            ok: false,
            json: () => Promise.resolve(mockErrorResponse),
        });
        global.fetch = mockFetch as any;

        // Задаем токен
        localStorage.setItem("access_token", "fake_token");

        await act(async () => {
            await addTodo(setTodos, setError, setLoading, "Test todo", "");
        });

        expect(loading).toBe(false);
        expect(error).not.toBeNull();
        expect(error!.message).toBe("Failed to add todo");
        expect(todos).toHaveLength(0);
        expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("handles error when user is not authenticated", async () => {
        const setTodos: React.Dispatch<React.SetStateAction<Todo[]>> = (
            newTodos
        ) => {
            todos = newTodos as Todo[];
        };
        const setError = (newError: Error | null) => {
            error = newError;
        };
        const setLoading = (newLoading: boolean) => {
            loading = newLoading;
        };

        // Удаляем токен
        localStorage.removeItem("access_token");

        await act(async () => {
            await addTodo(setTodos, setError, setLoading, "Test todo", "");
        });

        expect(loading).toBe(false);
        expect(error).not.toBeNull();
        expect(error!.message).toBe("User is not authenticated");
        expect(todos).toHaveLength(0);
    });
});
