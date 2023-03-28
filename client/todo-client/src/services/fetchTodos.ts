const fetchTodos = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
        return {
            data: null,
            error: new Error("User is not authenticated"),
            loading: false,
        };
    }

    try {
        const response = await fetch("http://localhost:3333/todos", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch todos");
        }

        const data = await response.json();

        return {
            data,
            error: null,
            loading: false,
        };
    } catch (error) {
        return {
            data: null,
            error,
            loading: false,
        };
    }
};

export default fetchTodos;
