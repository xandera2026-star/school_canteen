import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.setGlobalPrefix('v1');
  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  Logger.log(`🚀 XAndera backend running on port ${port}`);
}
void bootstrap();
