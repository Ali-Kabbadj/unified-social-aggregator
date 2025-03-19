import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private prisma: PrismaService) {}

  async getUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async getUserWithAccounts(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        socialLogins: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }

  async disconnectAccount(userId: string, provider: string) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        socialLogins: {
          where: { provider },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (user.socialLogins.length === 0) {
      throw new NotFoundException(`No ${provider} account found for this user`);
    }

    // Delete the social login
    await this.prisma.socialLogin.deleteMany({
      where: {
        userId,
        provider,
      },
    });

    this.logger.log(
      `Disconnected ${provider} account for user ${userId}`,
      'UserService',
    );

    return true;
  }
}
