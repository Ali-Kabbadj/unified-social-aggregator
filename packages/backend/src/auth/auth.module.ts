import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { YouTubeStrategy } from './strategies/youtube.strategy';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { CustomLogger } from '../logger/logger.service';

@Module({
  imports: [ConfigModule.forRoot(), PassportModule, PrismaModule],
  providers: [AuthService, YouTubeStrategy, CustomLogger],
  controllers: [AuthController],
})
export class AuthModule {}
