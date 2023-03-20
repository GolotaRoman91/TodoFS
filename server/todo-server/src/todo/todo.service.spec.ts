import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { TodoModel } from './todo.model';
import { UserModel } from '../auth/user.model';
import { getModelToken } from '@nestjs/sequelize';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(async () => {
    const todoModelMock = {
      provide: getModelToken(TodoModel),
      useValue: {},
    };

    const userModelMock = {
      provide: getModelToken(UserModel),
      useValue: {},
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [TodoService, todoModelMock, userModelMock],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
