import { SequelizeModule } from '@nestjs/sequelize';
import { Type } from '@nestjs/common';
import { BaseModel } from '../base.model';
import { ModelCtor } from 'sequelize-typescript';

export function databaseProvider(models: Type<BaseModel>[]) {
  return SequelizeModule.forRoot({
    dialect: 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    models: models as ModelCtor[],
    autoLoadModels: true,
  });
}
