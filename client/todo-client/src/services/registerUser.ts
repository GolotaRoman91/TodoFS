type Credentials = {
    login: string;
    password: string;
};

type ErrorResponse = {
    message: string;
};

export const registerUser = async ({ login, password }: Credentials) => {
    try {
        const response = await fetch("http://localhost:3333/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                login,
                password,
            }),
        });

        if (response.ok) {
            console.log("Registration successful");
        } else {
            const error: ErrorResponse = await response.json();
            throw new Error(error.message || "Failed to register");
        }
    } catch (error: unknown) {
        let errorMessage: string;

        if (error instanceof Error) {
            errorMessage = error.message;
        } else {
            errorMessage = "Unknown error";
        }

        throw new Error(errorMessage);
    }
};
