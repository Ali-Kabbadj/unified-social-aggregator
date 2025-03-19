/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';

@Injectable()
export class FeedsService {
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
}
