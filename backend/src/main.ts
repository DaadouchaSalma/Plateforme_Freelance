import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { graphqlUploadExpress } from 'graphql-upload-minimal'; 
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });
    app.use(graphqlUploadExpress({ maxFiles: 10 })); 
      app.use('/uploads', express.static(join(__dirname, '..', 'uploads'))); // 👈

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
