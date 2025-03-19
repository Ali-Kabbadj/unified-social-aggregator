import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { Logger } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  @Get('youtube')
  @UseGuards(AuthGuard('youtube'))
  youtubeAuth() {
    this.logger.log('Initiating YouTube OAuth flow');
  }

  @Get('youtube/callback')
  @UseGuards(AuthGuard('youtube'))
  youtubeCallback(@Req() req, @Res() res: Response) {
    this.logger.log('YouTube OAuth callback received');
    this.logger.log(
      `User email: ${req.user.email}`,
      'AuthController [youtubeCallback]',
    );

    // Store user ID in session or generate a JWT
    const userId = req.user.id;

    // Remove the /api prefix
    res.redirect(`/feeds?userId=${userId}`);
  }
}
