import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { CustomLogger } from '../../logger/logger.service';

@Injectable()
export class YouTubeStrategy extends PassportStrategy(Strategy, 'youtube') {
  constructor(
    private authService: AuthService,
    private config: ConfigService,
    private logger: CustomLogger,
  ) {
    const clientID = config.getOrThrow<string>('YOUTUBE_CLIENT_ID');
    const clientSecret = config.getOrThrow<string>('YOUTUBE_CLIENT_SECRET');
    const callbackURL = config.getOrThrow<string>('YOUTUBE_CALLBACK_URL');
    const scope = [
      'https://www.googleapis.com/auth/youtube.readonly',
      'profile',
      'email',
    ];
    const accessType = 'offline';
    super({
      clientID: clientID,
      clientSecret: clientSecret,
      callbackURL: callbackURL,
      scope: scope,
      accessType: accessType,
      prompt: 'consent',
    });

    this.logger.log(`🎬 YouTubeStrategy initialized`, 'OAuth');
    this.logger.log(`clientID : ${clientID}`, 'OAuth');
    this.logger.log(`clientSecret : ${clientSecret}`, 'OAuth');
    this.logger.log(`callbackURL : ${callbackURL}`, 'OAuth');
    this.logger.log(`scope : ${scope.toString()}`, 'OAuth');
    this.logger.log(`accessType :${accessType}`, 'OAuth');
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    this.logger.debug(
      `📝 Validating Profile with email: ${profile._json.email}`,
      'OAuth',
    );
    this.logger.debug('🔑 Access Token Received', 'OAuth');
    this.logger.verbose(`🔄 Refresh Token: ${refreshToken || 'None'}`, 'OAuth');

    try {
      const user = await this.authService.createOrUpdateUser({
        provider: 'youtube',
        providerId: profile.id,
        accessToken,
        refreshToken,
        email: profile.emails?.[0]?.value,
        displayName: profile.displayName,
        expiresAt: new Date(Date.now() + 3600 * 1000),
      });

      this.logger.log(
        `✅ User ${user.email} authenticated successfully`,
        'OAuth',
      );
      return user;
    } catch (error) {
      this.logger.error(
        `💥 Authentication failed: ${error.message}`,
        String(error.stack || 'No stack trace available'),
        'OAuth',
      );
      throw error;
    }
  }
}
