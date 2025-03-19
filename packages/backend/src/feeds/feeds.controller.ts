import {
  Controller,
  Get,
  Query,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { FeedsService } from './feeds.service';

@Controller('feeds')
export class FeedsController {
  private readonly logger = new Logger(FeedsController.name);

  constructor(private readonly feedsService: FeedsService) {}

  @Get()
  async getFeed(@Query('userId') userId: string) {
    if (!userId) {
      // If no userId is provided, return the mock feed
      return await this.feedsService.getMockFeed();
    }

    try {
      // Get the unified feed for the user
      return await this.feedsService.getUnifiedFeed(userId);
    } catch (error) {
      this.logger.error(
        `Error getting feed for user ${userId}: ${error.message}`,
      );
      throw new NotFoundException('Could not retrieve feed for this user');
    }
  }

  @Get('youtube')
  async getYouTubeFeed(@Query('userId') userId: string) {
    if (!userId) {
      throw new NotFoundException('User ID is required');
    }

    try {
      return await this.feedsService.getYouTubeFeed(userId);
    } catch (error) {
      this.logger.error(
        `Error getting YouTube feed for user ${userId}: ${error.message}`,
      );
      throw new NotFoundException(
        'Could not retrieve YouTube feed for this user',
      );
    }
  }
}
