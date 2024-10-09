import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { envs } from './config/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Prefix
  app.setGlobalPrefix('api');
  // DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  // Port
  await app.listen(envs.port);
}
bootstrap();
