import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { CustomLogger } from './logger/logger.service';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const Logger = new CustomLogger();
  Logger.setLogLevels(['log', 'error', 'warn', 'debug', 'verbose']); // Set log levels here

  Logger.setLogLevels(
    process.env.NODE_ENV === 'production'
      ? ['log', 'error', 'warn']
      : ['log', 'error', 'warn', 'debug', 'verbose'],
  );

  const app = await NestFactory.create(AppModule, {
    logger: Logger,
  });

  // Use cookie parser middleware
  app.use(cookieParser());

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // // Set global prefix
  // app.setGlobalPrefix('api');

  // Get PrismaService instance and connect
  const prismaService = app.get(PrismaService);
  await prismaService.onModuleInit();

  // Register shutdown hooks
  process.on('SIGINT', () => {
    void (async () => {
      await prismaService.onModuleDestroy();
      await app.close();
      process.exit(0);
    })();
  });

  process.on('SIGTERM', () => {
    void (async () => {
      await prismaService.onModuleDestroy();
      await app.close();
      process.exit(0);
    })();
  });

  await app.listen(3001);
  Logger.log(`Running in ${process.env.NODE_ENV} mode`, 'Bootstrap');
  Logger.log(`🚀 Server running on ${process.env.BACKEND_URL}`, 'Bootstrap');
}
void bootstrap();
