import { IsOptional } from 'class-validator';
import {
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  Length,
} from 'sequelize-typescript';
import { BaseModel } from '../base.model';
import { UserModel } from '../auth/user.model';

@Table({
  tableName: 'todos',
  timestamps: true,
})
export class TodoModel extends BaseModel {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.UUID,
  })
  userId: string;

  @BelongsTo(() => UserModel)
  user: UserModel;

  @Length({ min: 1, max: 255 })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @IsOptional()
  @Length({ min: 0, max: 1000 })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  completed: boolean;
}
