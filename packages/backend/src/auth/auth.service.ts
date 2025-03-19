import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private prisma: PrismaService) {}

  async createOrUpdateUser(profile: {
    provider: string;
    providerId: string;
    accessToken: string;
    refreshToken?: string;
    email?: string;
    displayName?: string;
    expiresAt?: Date;
  }) {
    this.logger.log(
      `Creating or updating user with email: ${profile.email}`,
      'AuthService',
    );

    return this.prisma.user.upsert({
      where: {
        email: profile.email,
      },
      create: {
        email: profile.email,
        displayName: profile.displayName,
        socialLogins: {
          create: {
            provider: profile.provider,
            providerId: profile.providerId,
            accessToken: profile.accessToken,
            refreshToken: profile.refreshToken,
            expiresAt: profile.expiresAt,
          },
        },
      },
      update: {
        socialLogins: {
          upsert: {
            where: {
              provider_providerId: {
                provider: profile.provider,
                providerId: profile.providerId,
              },
            },
            create: {
              provider: profile.provider,
              providerId: profile.providerId,
              accessToken: profile.accessToken,
              refreshToken: profile.refreshToken,
              expiresAt: profile.expiresAt,
            },
            update: {
              accessToken: profile.accessToken,
              refreshToken: profile.refreshToken,
              expiresAt: profile.expiresAt,
            },
          },
        },
      },
    });
  }
}
