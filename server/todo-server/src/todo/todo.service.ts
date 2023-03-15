import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from 'src/auth/user.model';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoModel } from './todo.model';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(TodoModel)
    private readonly todoModel: typeof TodoModel,
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
  ) {}

  async create(
    userEmail: string,
    createTodoDto: CreateTodoDto,
  ): Promise<TodoModel> {
    const user = await this.userModel.findOne({ where: { email: userEmail } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const todo = new TodoModel({
      ...createTodoDto,
      userId: user.id,
    });

    return await todo.save();
  }

  async findAll(userEmail: string): Promise<TodoModel[]> {
    return this.todoModel.findAll({
      include: [{ model: UserModel, where: { email: userEmail } }],
    });
  }

  async findOne(id: number, userEmail: string): Promise<TodoModel> {
    const todo = await this.todoModel.findOne({
      where: { id },
      include: [{ model: UserModel, where: { email: userEmail } }],
    });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return todo;
  }

  async update(
    userEmail: string,
    id: number,
    updateTodoDto: UpdateTodoDto,
  ): Promise<TodoModel> {
    const user = await this.userModel.findOne({ where: { email: userEmail } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const todo = await this.todoModel.findOne({
      where: { id, userId: user.id },
    });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    Object.assign(todo, updateTodoDto);
    await todo.save();

    return todo;
  }

  async remove(userEmail: string, id: number): Promise<void> {
    const user = await this.userModel.findOne({ where: { email: userEmail } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const todo = await this.todoModel.findOne({
      where: { id, userId: user.id },
    });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    await todo.destroy();
  }
}
