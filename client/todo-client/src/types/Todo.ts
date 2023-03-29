export type Todo = {
    id: number;
    userId: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        email: string;
        passwordHash: string;
        createdAt: string;
        updatedAt: string;
    };
};
