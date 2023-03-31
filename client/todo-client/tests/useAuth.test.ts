import { renderHook, act } from "@testing-library/react-hooks";
import { loginUser } from "../src/services/loginUser";
import { registerUser } from "../src/services/registerUser";
import useAuth from "../src/hooks/useAuth";

const navigate = jest.fn();

jest.mock("react-router-dom", () => ({
    useNavigate: () => navigate,
}));

jest.mock("../src/services/loginUser", () => ({
    loginUser: jest.fn(),
}));

jest.mock("../src/services/registerUser", () => ({
    registerUser: jest.fn(),
}));

describe("useAuth hook", () => {
    it("should toggle isLogin state", () => {
        const { result } = renderHook(() => useAuth());
        expect(result.current.isLogin).toBe(true);

        act(() => {
            result.current.setIsLogin(false);
        });

        expect(result.current.isLogin).toBe(false);
    });

    it("should call loginUser with correct arguments", async () => {
        const credentials = { login: "test", password: "test" };
        const email = "test@test.com";

        const { result } = renderHook(() => useAuth());
        await act(() => result.current.loginUser(credentials, email));

        expect(loginUser).toHaveBeenCalledWith(credentials, email, navigate);
    });

    it("should have registerUser function available", () => {
        const { result } = renderHook(() => useAuth());
        expect(result.current.registerUser).toBe(registerUser);
    });
});
