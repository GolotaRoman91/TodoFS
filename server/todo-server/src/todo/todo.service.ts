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

  findOne(id: number) {
    return `This action returns a #${id} todo`;
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    return `This action updates a #${id} todo`;
  }

  remove(id: number) {
    return `This action removes a #${id} todo`;
  }
}
