import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  isDone: boolean;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
