import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FeedsModule } from './feeds/feeds.module';
import { RequestLogger } from './core/request.logger';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot(),
    AuthModule,
    FeedsModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLogger).forRoutes('*');
  }
}
