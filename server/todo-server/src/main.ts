import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 7777;
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const serverStartedAt: number = Date.now();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
    console.log(`Server started for ${Date.now() - serverStartedAt}ms`);
  });
}
bootstrap();
