import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

// Extend the Request interface to include sessionId
declare module 'express' {
  export interface Request {
    sessionId?: string;
  }
}

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Check for existing session cookie
    const sessionId = req.cookies?.sessionId;

    if (sessionId) {
      // Validate session
      const session = await this.prisma.session.findUnique({
        where: { id: sessionId },
        include: { user: true },
      });

      if (session && new Date(session.expiresAt) > new Date()) {
        // Session is valid
        req.user = session.user;
        req.sessionId = sessionId;
      } else {
        // Session expired or invalid, clear cookie
        res.clearCookie('sessionId');
      }
    }

    next();
  }
}
