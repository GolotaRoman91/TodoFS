import removeTodo from "../src/services/removeTodo";
import * as nock from "nock";
import "cross-fetch/polyfill";

describe("removeTodo", () => {
    const mockApi = "http://localhost:3333";
    const todoId = 1;
    const token = "valid_token";

    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        nock.cleanAll();
    });

    it("should remove todo successfully", async () => {
        localStorage.setItem("access_token", token);
        nock(mockApi).delete(`/todos/${todoId}`).reply(200);

        const result = await removeTodo(todoId);

        expect(result).toEqual({
            removedTodoId: todoId,
            error: undefined,
            loading: false,
        });
    });

    it("should fail when user is not authenticated", async () => {
        const result = await removeTodo(todoId);

        expect(result).toEqual({
            removedTodoId: undefined,
            error: new Error("User is not authenticated"),
            loading: false,
        });
    });

    it("should fail when there is an error removing the todo", async () => {
        localStorage.setItem("access_token", token);
        nock(mockApi)
            .delete(`/todos/${todoId}`)
            .reply(500, { message: "Failed to remove todo" });

        const result = await removeTodo(todoId);

        expect(result).toEqual({
            removedTodoId: undefined,
            error: new Error("Failed to remove todo"),
            loading: false,
        });
    });

    it("should handle network errors", async () => {
        localStorage.setItem("access_token", token);
        nock(mockApi)
            .delete(`/todos/${todoId}`)
            .replyWithError("Network error");

        const result = await removeTodo(todoId);

        expect(result.loading).toBe(false);
        expect(result.removedTodoId).toBeUndefined();
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error!.message).toContain("Network error");
    });
});
