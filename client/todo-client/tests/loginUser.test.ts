import { loginUser } from "../src/services/loginUser";
import * as nock from "nock";
import "cross-fetch/polyfill";

describe("loginUser", () => {
    const mockApi = "http://localhost:3333";
    const validCredentials = {
        login: "test@example.com",
        password: "password",
    };

    const invalidCredentials = {
        login: "wrong@example.com",
        password: "wrong-password",
    };

    const authResponse = {
        access_token: "valid_token",
    };

    const navigate = jest.fn();

    afterEach(() => {
        nock.cleanAll();
        localStorage.clear();
        navigate.mockReset();
    });

    it("should log in user successfully", async () => {
        nock(mockApi)
            .post("/auth/login", validCredentials)
            .reply(200, authResponse);

        await loginUser(validCredentials, validCredentials.login, navigate);

        expect(localStorage.getItem("access_token")).toBe(
            authResponse.access_token
        );
        expect(localStorage.getItem("user_email")).toBe(validCredentials.login);
        expect(navigate).toHaveBeenCalledWith("/main");
    });

    it("should fail when login is unsuccessful", async () => {
        const errorMessage = "Failed to log in";

        nock(mockApi)
            .post("/auth/login", invalidCredentials)
            .reply(400, { message: errorMessage });

        try {
            await loginUser(
                invalidCredentials,
                invalidCredentials.login,
                navigate
            );
        } catch (error) {
            expect(error).toEqual(new Error(errorMessage));
        }

        expect(localStorage.getItem("access_token")).toBeNull();
        expect(localStorage.getItem("user_email")).toBeNull();
        expect(navigate).not.toHaveBeenCalled();
    });

    it("should throw an error when server responds with status 500", async () => {
        const serverErrorMessage = "Internal Server Error";

        nock(mockApi)
            .post("/auth/login", validCredentials)
            .reply(500, { message: serverErrorMessage });

        try {
            await loginUser(validCredentials, validCredentials.login, navigate);
        } catch (error) {
            expect(error).toEqual(new Error(serverErrorMessage));
        }

        expect(localStorage.getItem("access_token")).toBeNull();
        expect(navigate).not.toHaveBeenCalled();
    });
});
