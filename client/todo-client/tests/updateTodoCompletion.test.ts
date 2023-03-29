import updateTodoCompletion from "../src/services/updateTodoCompletion";
import * as nock from "nock";
import "cross-fetch/polyfill";
import { Todo } from "../src/types/Todo";

describe("updateTodoCompletion", () => {
    const mockApi = "http://localhost:3333";
    const token = "valid_token";
    const todos: Todo[] = [
        {
            id: 1,
            userId: "1",
            title: "Todo 1",
            description: "Description 1",
            completed: false,
            createdAt: "2023-03-22T00:00:00.000Z",
            updatedAt: "2023-03-22T00:00:00.000Z",
            user: {
                id: "1",
                email: "test@example.com",
                passwordHash: "hashed_password",
                createdAt: "2023-03-22T00:00:00.000Z",
                updatedAt: "2023-03-22T00:00:00.000Z",
            },
        },
        {
            id: 2,
            userId: "1",
            title: "Todo 2",
            description: "Description 2",
            completed: false,
            createdAt: "2023-03-22T00:00:00.000Z",
            updatedAt: "2023-03-22T00:00:00.000Z",
            user: {
                id: "1",
                email: "test@example.com",
                passwordHash: "hashed_password",
                createdAt: "2023-03-22T00:00:00.000Z",
                updatedAt: "2023-03-22T00:00:00.000Z",
            },
        },
    ];

    afterEach(() => {
        localStorage.removeItem("access_token");
        nock.cleanAll();
    });

    it("should successfully update todo completion", async () => {
        localStorage.setItem("access_token", token);
        const todoId = 1;
        const completed = true;
        const updatedTodo = { ...todos[0], completed };
        nock(mockApi)
            .patch(`/todos/${todoId}`, updatedTodo)
            .reply(200, updatedTodo);

        const result = await updateTodoCompletion(todos, todoId, completed);

        expect(result).toEqual({
            updatedTodos: [updatedTodo, todos[1]],
            error: undefined,
            loading: false,
        });
    });

    it("should fail when user is not authenticated", async () => {
        const todoId = 1;
        const completed = true;

        const result = await updateTodoCompletion(todos, todoId, completed);

        expect(result).toEqual({
            updatedTodos: undefined,
            error: new Error("User is not authenticated"),
            loading: false,
        });
    });

    it("should fail when todo is not found", async () => {
        localStorage.setItem("access_token", token);
        const todoId = 3;
        const completed = true;

        const result = await updateTodoCompletion(todos, todoId, completed);

        expect(result).toEqual({
            updatedTodos: undefined,
            error: new Error("Todo not found"),
            loading: false,
        });
    });

    it("should fail when todo update fails", async () => {
        localStorage.setItem("access_token", token);
        const todoId = 1;
        const completed = true;
        nock(mockApi)
            .patch(`/todos/${todoId}`, { ...todos[0], completed })
            .reply(500);

        const result = await updateTodoCompletion(todos, todoId, completed);

        expect(result).toEqual({
            updatedTodos: undefined,
            error: new Error("Failed to update todo"),
            loading: false,
        });
    });
});
