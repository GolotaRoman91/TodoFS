import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { TodoModel } from '../todo/todo.model';

@Table
export class UserModel extends Model<UserModel> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

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
