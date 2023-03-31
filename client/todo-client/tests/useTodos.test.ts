import { renderHook, act } from "@testing-library/react-hooks";
import addTodo from "../src/services/addTodo";
import fetchTodos from "../src/services/fetchTodos";
import removeTodo from "../src/services/removeTodo";
import updateTodoCompletion from "../src/services/updateTodoCompletion";
import useTodos from "../src/hooks/useTodos";

const mockedAddTodo = addTodo as jest.MockedFunction<typeof addTodo>;
const mockedFetchTodos = fetchTodos as jest.MockedFunction<typeof fetchTodos>;
const mockedRemoveTodo = removeTodo as jest.MockedFunction<typeof removeTodo>;
const mockedUpdateTodoCompletion = updateTodoCompletion as jest.MockedFunction<
    typeof updateTodoCompletion
>;

jest.mock("../src/services/addTodo", () => ({
    __esModule: true,
    default: jest.fn(),
}));
jest.mock("../src/services/fetchTodos", () => ({
    __esModule: true,
    default: jest.fn(),
}));
jest.mock("../src/services/removeTodo", () => ({
    __esModule: true,
    default: jest.fn(),
}));
jest.mock("../src/services/updateTodoCompletion", () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe("useTodos hook", () => {
    const mockTodos = [
        {
            id: 1,
            userId: "1",
            title: "Test todo 1",
            description: "Test description 1",
            completed: false,
            createdAt: "2023-01-01T00:00:00.000Z",
            updatedAt: "2023-01-01T00:00:00.000Z",
            user: {
                id: "1",
                email: "test@example.com",
                passwordHash: "hashed_password",
                createdAt: "2023-01-01T00:00:00.000Z",
                updatedAt: "2023-01-01T00:00:00.000Z",
            },
        },
        {
            id: 2,
            userId: "1",
            title: "Test todo 2",
            description: "Test description 2",
            completed: false,
            createdAt: "2023-01-01T00:00:00.000Z",
            updatedAt: "2023-01-01T00:00:00.000Z",
            user: {
                id: "1",
                email: "test@example.com",
                passwordHash: "hashed_password",
                createdAt: "2023-01-01T00:00:00.000Z",
                updatedAt: "2023-01-01T00:00:00.000Z",
            },
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should fetch todos and set them", async () => {
        mockedFetchTodos.mockResolvedValue({
            data: mockTodos,
            error: null,
            loading: false,
        });

        const { result, waitForNextUpdate } = renderHook(() => useTodos());
        await waitForNextUpdate();

        expect(fetchTodos).toHaveBeenCalled();
        expect(result.current.todos).toEqual(mockTodos);
    });

    it("should add a new todo", async () => {
        mockedAddTodo.mockResolvedValue({
            newTodo: mockTodos[0],
            error: null,
            loading: false,
        });

        const { result } = renderHook(() => useTodos());
        await act(() =>
            result.current.addTodo("Test todo 1", "Test description 1")
        );

        expect(addTodo).toHaveBeenCalledWith({
            title: "Test todo 1",
            description: "Test description 1",
        });
        expect(result.current.todos).toContainEqual(mockTodos[0]);
    });

    it("should update todo completion", async () => {
        mockedUpdateTodoCompletion.mockResolvedValue({
            updatedTodos: [{ ...mockTodos[0], completed: true }],
            error: null,
            loading: false,
        });

        const { result } = renderHook(() => useTodos());
        result.current.setTodos(mockTodos);
        await act(() => result.current.updateTodoCompletion(1, true));

        expect(updateTodoCompletion).toHaveBeenCalledWith(mockTodos, 1, true);
        expect(result.current.todos[0].completed).toBe(true);
    });

    it("should remove a todo", async () => {
        mockedRemoveTodo.mockResolvedValue({
            removedTodoId: 1,
            error: null,
            loading: false,
        });

        const { result } = renderHook(() => useTodos());
        result.current.setTodos(mockTodos);
        await act(() => result.current.removeTodo(1));

        expect(removeTodo).toHaveBeenCalledWith(1);
        expect(result.current.todos).not.toContainEqual(mockTodos[0]);
    });
});
