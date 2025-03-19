import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { google, youtube_v3 } from 'googleapis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class YouTubeService {
  private readonly logger = new Logger(YouTubeService.name);
  private youtube = google.youtube('v3');

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  private async getAuthClient(userId: string) {
    const socialLogin = await this.prisma.socialLogin.findFirst({
      where: {
        userId,
        provider: 'youtube',
      },
    });

    if (!socialLogin) {
      throw new Error('No YouTube account connected for this user');
    }

    const auth = new google.auth.OAuth2(
      this.config.get('YOUTUBE_CLIENT_ID'),
      this.config.get('YOUTUBE_CLIENT_SECRET'),
      this.config.get('YOUTUBE_CALLBACK_URL'),
    );

    auth.setCredentials({
      access_token: socialLogin.accessToken,
      refresh_token: socialLogin.refreshToken || undefined,
      expiry_date: socialLogin.expiresAt?.getTime() || undefined,
    });

    // Set up token refresh handler
    auth.on('tokens', async (tokens) => {
      this.logger.log('Refreshing YouTube tokens', 'YouTubeService');

      if (tokens.access_token) {
        await this.prisma.socialLogin.update({
          where: {
            id: socialLogin.id,
          },
          data: {
            accessToken: tokens.access_token,
            ...(tokens.refresh_token && { refreshToken: tokens.refresh_token }),
            ...(tokens.expiry_date && {
              expiresAt: new Date(tokens.expiry_date),
            }),
          },
        });
      }
    });

    return auth;
  }

  async getSubscriptions(userId: string) {
    try {
      const auth = await this.getAuthClient(userId);

      const response = await this.youtube.subscriptions.list({
        auth,
        part: ['snippet'],
        mine: true,
        maxResults: 50,
      });

      return response.data.items || [];
    } catch (error: any) {
      this.logger.error(`Failed to fetch subscriptions: ${error.message}`);
      throw error;
    }
  }

  async getUserInfo(userId: string) {
    try {
      const auth = await this.getAuthClient(userId);

      const response = await this.youtube.channels.list({
        auth,
        part: ['snippet', 'contentDetails', 'statistics'],
        mine: true,
      });

      if (!response.data.items || response.data.items.length === 0) {
        return null;
      }

      return response.data.items[0];
    } catch (error: any) {
      this.logger.error(`Failed to fetch user info: ${error.message}`);
      throw error;
    }
  }

  async getSubscriptionVideos(userId: string, maxResults = 50) {
    try {
      const subscriptions = await this.getSubscriptions(userId);

      if (subscriptions.length === 0) {
        return [];
      }

      // Get channel IDs from subscriptions
      const channelIds: string[] = [];

      // Safely extract channel IDs
      for (const sub of subscriptions) {
        if (
          sub.snippet &&
          sub.snippet.resourceId &&
          sub.snippet.resourceId.channelId
        ) {
          channelIds.push(sub.snippet.resourceId.channelId);
        }
      }

      // Limit to 10 channels to avoid rate limits
      const limitedChannelIds = channelIds.slice(0, 10);

      if (limitedChannelIds.length === 0) {
        return [];
      }

      const auth = await this.getAuthClient(userId);

      // Get videos from each channel
      const videoPromises = limitedChannelIds.map((channelId) =>
        this.youtube.search.list({
          auth,
          part: ['snippet'],
          channelId,
          maxResults: 5,
          order: 'date',
          type: ['video'],
        }),
      );

      const responses = await Promise.all(videoPromises);
      const videos: any[] = [];

      // Process each response safely
      for (const response of responses) {
        if (response.data.items) {
          for (const item of response.data.items) {
            if (item && item.id && item.id.videoId && item.snippet) {
              videos.push({
                id: item.id.videoId,
                platform: 'youtube',
                type: 'video',
                title: item.snippet.title || '',
                description: item.snippet.description || '',
                url: `https://youtube.com/watch?v=${item.id.videoId}`,
                thumbnail:
                  (item.snippet.thumbnails &&
                    item.snippet.thumbnails.high &&
                    item.snippet.thumbnails.high.url) ||
                  (item.snippet.thumbnails &&
                    item.snippet.thumbnails.default &&
                    item.snippet.thumbnails.default.url) ||
                  '',
                channelTitle: item.snippet.channelTitle || '',
                channelId: item.snippet.channelId || '',
                publishedAt: item.snippet.publishedAt || '',
              });
            }
          }
        }
      }

      // Sort videos by publishedAt
      return videos.sort((a, b) => {
        const bDate = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const aDate = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return bDate - aDate;
      });
    } catch (error: any) {
      this.logger.error(
        `Failed to fetch subscription videos: ${error.message}`,
      );
      throw error;
    }
  }

  async getRecommendedVideos(userId: string, maxResults = 20) {
    try {
      const auth = await this.getAuthClient(userId);

      const response = await this.youtube.videos.list({
        auth,
        part: ['snippet', 'contentDetails', 'statistics'],
        chart: 'mostPopular',
        regionCode: 'US', // Could be made dynamic based on user preference
        maxResults,
      });

      const videos: any[] = [];

      if (response.data.items) {
        for (const item of response.data.items) {
          if (item && item.snippet) {
            videos.push({
              id: item.id || '',
              platform: 'youtube',
              type: 'video',
              title: item.snippet.title || '',
              description: item.snippet.description || '',
              url: `https://youtube.com/watch?v=${item.id}`,
              thumbnail:
                (item.snippet.thumbnails &&
                  item.snippet.thumbnails.high &&
                  item.snippet.thumbnails.high.url) ||
                (item.snippet.thumbnails &&
                  item.snippet.thumbnails.default &&
                  item.snippet.thumbnails.default.url) ||
                '',
              channelTitle: item.snippet.channelTitle || '',
              channelId: item.snippet.channelId || '',
              publishedAt: item.snippet.publishedAt || '',
              viewCount: item.statistics && item.statistics.viewCount,
              likeCount: item.statistics && item.statistics.likeCount,
              duration: item.contentDetails && item.contentDetails.duration,
            });
          }
        }
      }

      return videos;
    } catch (error: any) {
      this.logger.error(`Failed to fetch recommended videos: ${error.message}`);
      throw error;
    }
  }
}
