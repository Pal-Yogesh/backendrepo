import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { TasksService } from './tasks/tasks.service';
import { setupSocket } from './socket';
import * as http from 'http';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://frontendrepo-three.vercel.app',
      // 'http://localhost:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.use(cookieParser());

  const server = http.createServer(app.getHttpAdapter().getInstance());
  const tasksService = app.get(TasksService);
  setupSocket(server, tasksService);

  await app.listen(5001);
  console.log('Backend running on 5001');
}

bootstrap();
