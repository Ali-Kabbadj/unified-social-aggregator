import { Controller, Get } from '@nestjs/common';
import { FeedsService } from './feeds.service';

@Controller('feeds')
export class FeedsController {
  constructor(private readonly feedsService: FeedsService) {}

  @Get()
  async getFeed() {
    return await this.feedsService.getMockFeed();
  }
}
