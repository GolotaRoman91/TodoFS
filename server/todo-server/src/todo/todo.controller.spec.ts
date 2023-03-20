import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateTodoDto } from './dto/update-todo.dto';

describe('TodoController', () => {
  let controller: TodoController;
  let todoService: TodoService;

  beforeEach(async () => {
    const todoServiceMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [{ provide: TodoService, useValue: todoServiceMock }],
    }).compile();

    controller = module.get<TodoController>(TodoController);
    todoService = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call the create method of the todoService with the right arguments', async () => {
      const userEmail = 'user@example.com';
      const createTodoDto: CreateTodoDto = {
        title: 'Test task',
        completed: false,
      };

      await controller.create(userEmail, createTodoDto);

      expect(todoService.create).toHaveBeenCalledWith(userEmail, createTodoDto);
    });

    it('should return the result of the create method of the todoService', async () => {
      const userEmail = 'user@example.com';
      const createTodoDto: CreateTodoDto = {
        title: 'Test task',
        completed: false,
      };
      const expectedResult = {
        id: 1,
        title: 'Test task',
        userEmail: 'user@example.com',
        completed: false,
      };

      (todoService.create as jest.Mock).mockResolvedValue(expectedResult);

      const result = await controller.create(userEmail, createTodoDto);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAllTodos', () => {
    it('should call the findAll method of the todoService with the right arguments', async () => {
      const userEmail = 'user@example.com';

      await controller.findAllTodos(userEmail);

      expect(todoService.findAll).toHaveBeenCalledWith(userEmail);
    });

    it('should return the result of the findAll method of the todoService', async () => {
      const userEmail = 'user@example.com';
      const expectedResult = [
        {
          id: 1,
          title: 'Test task 1',
          userEmail: 'user@example.com',
          completed: false,
        },
        {
          id: 2,
          title: 'Test task 2',
          userEmail: 'user@example.com',
          completed: true,
        },
      ];

      (todoService.findAll as jest.Mock).mockResolvedValue(expectedResult);

      const result = await controller.findAllTodos(userEmail);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should call the findOne method of the todoService with the right arguments', async () => {
      const userEmail = 'user@example.com';
      const id = 1;

      await controller.findOne(userEmail, id.toString());

      expect(todoService.findOne).toHaveBeenCalledWith(id, userEmail);
    });

    it('should return the result of the findOne method of the todoService', async () => {
      const userEmail = 'user@example.com';
      const id = 1;
      const expectedResult = {
        id: 1,
        title: 'Test task 1',
        userEmail: 'user@example.com',
        completed: false,
      };

      (todoService.findOne as jest.Mock).mockResolvedValue(expectedResult);

      const result = await controller.findOne(userEmail, id.toString());

      expect(result).toEqual(expectedResult);
    });

    it('should throw an error if the todo is not found', async () => {
      const userEmail = 'user@example.com';
      const id = 999;

      (todoService.findOne as jest.Mock).mockReturnValue(
        Promise.reject(new NotFoundException()),
      );

      await expect(
        controller.findOne(userEmail, id.toString()),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should call the update method of the todoService with the right arguments', async () => {
      const userEmail = 'user@example.com';
      const id = 1;
      const updateTodoDto: UpdateTodoDto = {
        title: 'Updated title',
        description: 'Updated description',
        completed: true,
      };
      const updatedTodo = {
        id,
        ...updateTodoDto,
      };

      (todoService.update as jest.Mock).mockResolvedValue(updatedTodo);

      await controller.update(userEmail, id.toString(), updateTodoDto);

      expect(todoService.update).toHaveBeenCalledWith(
        userEmail,
        id,
        updateTodoDto,
      );
    });

    it('should return the result of the update method of the todoService', async () => {
      const userEmail = 'user@example.com';
      const id = 1;
      const updateTodoDto: UpdateTodoDto = {
        title: 'Updated title',
        description: 'Updated description',
        completed: true,
      };
      const updatedTodo = {
        id,
        ...updateTodoDto,
      };

      (todoService.update as jest.Mock).mockResolvedValue(updatedTodo);

      const result = await controller.update(
        userEmail,
        id.toString(),
        updateTodoDto,
      );

      expect(result).toEqual(updatedTodo);
    });

    it('should throw an error if the todo is not found', async () => {
      const userEmail = 'user@example.com';
      const id = 999;
      const updateTodoDto: UpdateTodoDto = {
        title: 'Updated title',
        description: 'Updated description',
        completed: true,
      };

      (todoService.update as jest.Mock).mockReturnValue(
        Promise.reject(new NotFoundException()),
      );

      await expect(
        controller.update(userEmail, id.toString(), updateTodoDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should call the remove method of the todoService with the right arguments', async () => {
      const userEmail = 'user@example.com';
      const id = 1;

      (todoService.remove as jest.Mock).mockResolvedValue(true);

      await controller.remove(userEmail, id.toString());

      expect(todoService.remove).toHaveBeenCalledWith(userEmail, id);
    });

    it('should return the result of the remove method of the todoService', async () => {
      const userEmail = 'user@example.com';
      const id = 1;

      (todoService.remove as jest.Mock).mockResolvedValue(true);

      const result = await controller.remove(userEmail, id.toString());

      expect(result).toEqual(true);
    });

    it('should throw an error if the todo is not found', async () => {
      const userEmail = 'user@example.com';
      const id = 999;

      (todoService.remove as jest.Mock).mockReturnValue(
        Promise.reject(new NotFoundException()),
      );

      await expect(controller.remove(userEmail, id.toString())).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
