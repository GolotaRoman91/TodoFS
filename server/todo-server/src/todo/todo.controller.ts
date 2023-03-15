import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { UserEmail } from 'src/decorators/user-email.decorator';

@Controller('/todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@UserEmail() userEmail: string, @Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(userEmail, createTodoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAllTodos(@UserEmail() userEmail: string) {
    return this.todoService.findAll(userEmail);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@UserEmail() userEmail: string, @Param('id') id: string) {
    return this.todoService.findOne(+id, userEmail);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @UserEmail() userEmail: string,
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todoService.update(userEmail, +id, updateTodoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@UserEmail() userEmail: string, @Param('id') id: string) {
    return this.todoService.remove(userEmail, +id);
  }
}
