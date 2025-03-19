import { Injectable, Logger } from '@nestjs/common';
import { YouTubeService } from 'src/youtube/youtube.service';

@Injectable()
export class FeedsService {
  private readonly logger = new Logger(FeedsService.name);

  constructor(private readonly youtubeService: YouTubeService) {}

  async getMockFeed() {
    return {
      items: [
        {
          id: '1',
          platform: 'youtube',
          type: 'video',
          title: 'Sample Video',
          url: 'https://youtube.com/watch?v=123',
          thumbnail: 'https://img.youtube.com/vi/123/hqdefault.jpg',
          timestamp: new Date().toISOString(),
        },
      ],
    };
  }

  async getYouTubeFeed(userId: string) {
    try {
      const subscriptionVideos =
        await this.youtubeService.getSubscriptionVideos(userId);

      // If no subscription videos, get recommended videos
      const videos =
        subscriptionVideos.length > 0
          ? subscriptionVideos
          : await this.youtubeService.getRecommendedVideos(userId);

      // Get user info
      const userInfo = await this.youtubeService.getUserInfo(userId);

      return {
        user: {
          id: userId,
          platform: 'youtube',
          username: userInfo?.snippet?.title || 'YouTube User',
          thumbnail: userInfo?.snippet?.thumbnails?.default?.url,
          subscriberCount: userInfo?.statistics?.subscriberCount,
        },
        items: videos,
      };
    } catch (error) {
      this.logger.error(`Failed to get YouTube feed: ${error.message}`);
      throw error;
    }
  }

  async getUnifiedFeed(userId: string) {
    // For now, we only have YouTube, but later we can add other platforms
    const youtubeFeed = await this.getYouTubeFeed(userId);

    return {
      user: {
        id: userId,
        platforms: ['youtube'],
      },
      feeds: {
        youtube: youtubeFeed,
      },
      // Merge all items from all platforms and sort by date
      items: youtubeFeed.items
        .map((item) => ({
          ...item,
          timestamp: item.publishedAt,
        }))
        .sort(
          (a, b) =>
            new Date(b.timestamp || 0).getTime() -
            new Date(a.timestamp || 0).getTime(),
        ),
    };
  }
}
