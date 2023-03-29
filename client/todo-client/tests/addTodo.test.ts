import addTodo from "../src/services/addTodo";
import * as nock from "nock";
import "cross-fetch/polyfill";

describe("addTodo", () => {
    const mockApi = "http://localhost:3333";
    const validToken = "valid_token";
    const invalidToken = "invalid_token";

    beforeEach(() => {
        localStorage.setItem("access_token", validToken);
    });

    afterEach(() => {
        nock.cleanAll();
        localStorage.clear();
    });

    it("should add a new todo successfully", async () => {
        const newTodo = {
            id: 1,
            title: "Test title",
            description: "Test description",
            completed: false,
        };

        nock(mockApi)
            .post("/todos", {
                title: newTodo.title,
                description: newTodo.description,
                completed: false,
            })
            .reply(200, newTodo);

        const result = await addTodo({
            title: newTodo.title,
            description: newTodo.description,
        });

        const { newTodo: createdTodo, error, loading } = result;

        expect(createdTodo).toEqual(newTodo);
        expect(error).toBeUndefined();
        expect(loading).toBe(false);
    });

    it("should fail when not authenticated", async () => {
        localStorage.removeItem("access_token");

        const { newTodo, error, loading } = await addTodo({
            title: "Test title",
            description: "Test description",
        });

        expect(newTodo).toBeUndefined();
        expect(error).toEqual(new Error("User is not authenticated"));
        expect(loading).toBe(false);
    });

    it("should fail when adding todo is unsuccessful", async () => {
        const newTodo = {
            title: "Test title",
            description: "Test description",
            completed: false,
        };

        nock(mockApi, {
            reqheaders: {
                Authorization: `Bearer ${validToken}`,
            },
        })
            .post("/todos", newTodo)
            .reply(400);

        const {
            newTodo: createdTodo,
            error,
            loading,
        } = await addTodo({
            title: newTodo.title,
            description: newTodo.description,
        });

        expect(createdTodo).toBeUndefined();
        expect(error).toEqual(new Error("Failed to add todo"));
        expect(loading).toBe(false);
    });
});
