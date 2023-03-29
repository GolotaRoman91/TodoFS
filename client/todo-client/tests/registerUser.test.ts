import { registerUser } from "../src/services/registerUser";
import * as nock from "nock";
import "cross-fetch/polyfill";

describe("registerUser", () => {
    const mockApi = "http://localhost:3333";
    const validCredentials = {
        login: "test@example.com",
        password: "password",
    };

    const invalidCredentials = {
        login: "test@example.com",
        password: "short",
    };

    afterEach(() => {
        nock.cleanAll();
    });

    it("should register user successfully", async () => {
        nock(mockApi).post("/auth/register", validCredentials).reply(200);

        let result;
        try {
            result = await registerUser(validCredentials);
        } catch (error) {
            // This block should not be executed
            expect(false).toBe(true);
        }

        expect(result).toBeUndefined();
    });

    it("should fail when registration is unsuccessful", async () => {
        const errorMessage = "Failed to register";

        nock(mockApi)
            .post("/auth/register", invalidCredentials)
            .reply(400, { message: errorMessage });

        try {
            await registerUser(invalidCredentials);
        } catch (error) {
            expect(error).toEqual(new Error(errorMessage));
        }
    });

    it("should throw network error when an unexpected error occurs", async () => {
        nock(mockApi)
            .post("/auth/register", validCredentials)
            .replyWithError({ message: "Network error" });

        try {
            await registerUser(validCredentials);
        } catch (error: unknown) {
            if (error instanceof Error) {
                expect(error.message).toContain("Network error");
            } else {
                fail("Error is not an instance of Error");
            }
        }
    });
});
