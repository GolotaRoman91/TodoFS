import { useCallback } from "react";
import { NavigateFunction } from "react-router-dom";

const useLogout = (navigate: NavigateFunction) => {
    const logout = useCallback(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_email");
        navigate("/login");
    }, [navigate]);

    return logout;
};

export default useLogout;
