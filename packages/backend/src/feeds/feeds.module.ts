import { Module } from '@nestjs/common';
import { FeedsController } from './feeds.controller';
import { FeedsService } from './feeds.service';

@Module({
  controllers: [FeedsController],
  providers: [FeedsService],
})
export class FeedsModule {}
