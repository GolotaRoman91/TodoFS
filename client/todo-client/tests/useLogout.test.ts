import { renderHook, act } from "@testing-library/react-hooks";
import { NavigateFunction } from "react-router-dom";
import useLogout from "../src/hooks/useLogout";
import "jest-localstorage-mock";

const navigate = jest.fn();

describe("useLogout hook", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    it("should remove access_token and user_email from localStorage and navigate to /login", () => {
        localStorage.setItem("access_token", "test_token");
        localStorage.setItem("user_email", "test@example.com");

        const { result } = renderHook(() => useLogout(navigate));

        act(() => {
            result.current();
        });

        expect(localStorage.removeItem).toHaveBeenCalledWith("access_token");
        expect(localStorage.removeItem).toHaveBeenCalledWith("user_email");
        expect(navigate).toHaveBeenCalledWith("/login");
    });
});
