import fetchTodos from "../src/services/fetchTodos";
import * as nock from "nock";
import "cross-fetch/polyfill";

describe("fetchTodos", () => {
    const mockApi = "http://localhost:3333";
    const validToken = "valid_token";

    beforeEach(() => {
        localStorage.setItem("access_token", validToken);
    });

    afterEach(() => {
        nock.cleanAll();
        localStorage.clear();
    });

    it("should fetch todos successfully", async () => {
        const todos = [
            {
                id: 1,
                title: "Test title 1",
                description: "Test description 1",
                completed: false,
            },
            {
                id: 2,
                title: "Test title 2",
                description: "Test description 2",
                completed: true,
            },
        ];

        nock(mockApi, {
            reqheaders: {
                Authorization: `Bearer ${validToken}`,
            },
        })
            .get("/todos")
            .reply(200, todos);

        const { data, error, loading } = await fetchTodos();

        expect(data).toEqual(todos);
        expect(error).toBeNull();
        expect(loading).toBe(false);
    });

    it("should fail when not authenticated", async () => {
        localStorage.removeItem("access_token");

        const { data, error, loading } = await fetchTodos();

        expect(data).toBeNull();
        expect(error).toEqual(new Error("User is not authenticated"));
        expect(loading).toBe(false);
    });

    it("should fail when fetching todos is unsuccessful", async () => {
        nock(mockApi, {
            reqheaders: {
                Authorization: `Bearer ${validToken}`,
            },
        })
            .get("/todos")
            .reply(400);

        const { data, error, loading } = await fetchTodos();

        expect(data).toBeNull();
        expect(error).toEqual(new Error("Failed to fetch todos"));
        expect(loading).toBe(false);
    });
});
