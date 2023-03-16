import { Table, Column, DataType, HasMany } from 'sequelize-typescript';
import { BaseModel } from '../base.model';
import { TodoModel } from '../todo/todo.model';

@Table
export class UserModel extends BaseModel {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  passwordHash: string;

  @HasMany(() => TodoModel)
  todos: TodoModel[];
}
