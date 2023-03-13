import { SequelizeModule } from '@nestjs/sequelize';

export function databaseProvider(models: any[]) {
  return SequelizeModule.forRoot({
    dialect: 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    models: models,
    autoLoadModels: true,
  });
}
