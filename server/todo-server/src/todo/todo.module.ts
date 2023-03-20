import { UserModel } from './../auth/user.model';
import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TodoModel } from './todo.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([TodoModel, UserModel]), AuthModule],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
