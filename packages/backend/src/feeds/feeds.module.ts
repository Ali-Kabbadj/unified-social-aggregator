import { Module } from '@nestjs/common';
import { FeedsController } from './feeds.controller';
import { FeedsService } from './feeds.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { YouTubeService } from 'src/youtube/youtube.service';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [FeedsController],
  providers: [FeedsService, YouTubeService],
})
export class FeedsModule {}
