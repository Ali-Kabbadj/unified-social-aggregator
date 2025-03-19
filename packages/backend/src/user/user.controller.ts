import {
  Controller,
  Get,
  Post,
  Param,
  NotFoundException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Get(':userId')
  async getUserInfo(@Param('userId') userId: string) {
    try {
      const user = await this.userService.getUserById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to get user info: ${errorMessage}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to retrieve user information',
      );
    }
  }

  @Get(':userId/settings')
  async getUserSettings(@Param('userId') userId: string) {
    try {
      const userWithAccounts =
        await this.userService.getUserWithAccounts(userId);
      if (!userWithAccounts) {
        throw new NotFoundException('User not found');
      }

      return {
        id: userWithAccounts.id,
        email: userWithAccounts.email,
        displayName: userWithAccounts.displayName,
        connectedAccounts: userWithAccounts.socialLogins.map((login) => ({
          provider: login.provider,
          providerId: login.providerId,
          expiresAt: login.expiresAt,
        })),
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to get user settings: ${errorMessage}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to retrieve user settings',
      );
    }
  }

  @Post(':userId/disconnect/:provider')
  async disconnectAccount(
    @Param('userId') userId: string,
    @Param('provider') provider: string,
  ) {
    try {
      await this.userService.disconnectAccount(userId, provider);

      // Return updated user settings
      const updatedUser = await this.userService.getUserWithAccounts(userId);
      return {
        id: updatedUser.id,
        email: updatedUser.email,
        displayName: updatedUser.displayName,
        connectedAccounts: updatedUser.socialLogins.map((login) => ({
          provider: login.provider,
          providerId: login.providerId,
          expiresAt: login.expiresAt,
        })),
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to disconnect account: ${errorMessage}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to disconnect account');
    }
  }
}
