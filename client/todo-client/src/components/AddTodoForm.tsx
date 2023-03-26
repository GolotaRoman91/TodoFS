import React, { useState } from "react";
import { Input, Button, HStack } from "@chakra-ui/react";

interface AddTodoFormProps {
    onAddTodo: (title: string, description: string) => void;
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAddTodo }) => {
    const [inputValue, setInputValue] = useState("");

    const handleAddTodo = (event: React.FormEvent) => {
        event.preventDefault();
        if (inputValue) {
            onAddTodo(inputValue, "");
            setInputValue("");
        }
    };

    return (
        <form onSubmit={handleAddTodo}>
            <HStack>
                <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter a todo"
                />
                <Button type="submit" colorScheme="blue">
                    Add
                </Button>
            </HStack>
        </form>
    );
};

export default AddTodoForm;
