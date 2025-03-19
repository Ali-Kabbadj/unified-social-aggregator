import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomLogger } from '../logger/logger.service';
import chalk from 'chalk';

@Injectable()
export class RequestLogger implements NestMiddleware {
  MAX_URL_LENGTH = 50;
  constructor(private readonly logger: CustomLogger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      const statusCode = res.statusCode;

      // Define specific colors for specific status codes
      let statusColor;
      switch (statusCode) {
        case 200:
          statusColor = chalk.green; // OK
          break;
        case 201:
          statusColor = chalk.greenBright; // Created
          break;
        case 204:
          statusColor = chalk.cyan; // No Content
          break;
        case 301:
          statusColor = chalk.blue; // Moved Permanently
          break;
        case 302:
          statusColor = chalk.blueBright; // Found
          break;
        case 400:
          statusColor = chalk.yellow; // Bad Request
          break;
        case 401:
          statusColor = chalk.yellowBright; // Unauthorized
          break;
        case 403:
          statusColor = chalk.magenta; // Forbidden
          break;
        case 404:
          statusColor = chalk.magentaBright; // Not Found
          break;
        case 500:
          statusColor = chalk.red; // Internal Server Error
          break;
        case 503:
          statusColor = chalk.redBright; // Service Unavailable
          break;
        default:
          statusColor = (text: string) => text; // Default (no color)
          break;
      }

      const coloredStatusCode = statusColor(statusCode.toString());
      const truncatedUrl = truncateUrl(req.url, this.MAX_URL_LENGTH);
      const message = `🌐 {${truncatedUrl}, ${req.method}} → ${coloredStatusCode} (${duration}ms)`;

      if (statusCode >= 500) {
        this.logger.error(message, 'HTTP');
      } else if (statusCode >= 400) {
        this.logger.warn(message, 'HTTP');
      } else {
        this.logger.log(message, 'HTTP');
      }
    });

    next();
  }
}

function truncateUrl(url: string, maxLength: number): string {
  return url.length > maxLength ? `${url.slice(0, maxLength - 3)}...` : url;
}
