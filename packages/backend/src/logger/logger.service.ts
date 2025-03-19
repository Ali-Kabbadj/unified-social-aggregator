import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import { clc } from '@nestjs/common/utils/cli-colors.util';

@Injectable()
export class CustomLogger implements LoggerService {
  private logLevels: LogLevel[] = ['log', 'error', 'warn', 'debug', 'verbose'];
  private readonly CONTEXT_MAX_LENGTH = 15;
  private readonly LEVEL_MAX_LENGTH = 8;

  private getEmoji(level: LogLevel): string {
    switch (level) {
      case 'log':
        return '📘';
      case 'error':
        return '🚨';
      case 'warn':
        return '⚠️';
      case 'debug':
        return '🐛';
      case 'verbose':
        return '📢';
      default:
        return '🔍';
    }
  }

  private formatContext(context: string): string {
    const rawContext = context
      .slice(0, this.CONTEXT_MAX_LENGTH)
      .padEnd(this.CONTEXT_MAX_LENGTH, ' ');
    return clc.magentaBright(`[${rawContext}]`);
  }

  private colorizeMessage(message: string): string {
    // Colorize route patterns {/something}
    let colored = message.replace(/(\{.*?\})/g, clc.green('$1'));
    // Colorize URLs
    colored = colored.replace(/(https?:\/\/\S+)/gi, clc.cyanBright('$1'));
    return colored;
  }

  setLogLevels(levels: LogLevel[]) {
    this.logLevels = levels;
  }

  log(message: string, context?: string) {
    if (this.logLevels.includes('log')) {
      this.printMessage('log', message, context);
    }
  }

  error(message: string, trace: string, context?: string) {
    if (this.logLevels.includes('error')) {
      this.printMessage('error', `${message}\n${trace}`, context);
    }
  }

  warn(message: string, context?: string) {
    if (this.logLevels.includes('warn')) {
      this.printMessage('warn', message, context);
    }
  }

  debug(message: string, context?: string) {
    if (this.logLevels.includes('debug')) {
      this.printMessage('debug', message, context);
    }
  }

  verbose(message: string, context?: string) {
    if (this.logLevels.includes('verbose')) {
      this.printMessage('verbose', message, context);
    }
  }

  private printMessage(level: LogLevel, message: string, context?: string) {
    const emoji = this.getEmoji(level);
    const color = this.getColor(level);
    const paddedLevel = level.toUpperCase().padEnd(this.LEVEL_MAX_LENGTH, ' ');
    const formattedContext = this.formatContext(context || '');

    const processedMessage = this.colorizeMessage(message);

    // process.stdout.write(
    //   `${color(emoji)} ${clc.green(process.pid.toString())}  - ${this.getTimestamp()}   ` +
    //     `${color(level.toUpperCase())} ${formattedContext} ${message}\n`,
    // );

    process.stdout.write(
      `${color(emoji)} ${color(paddedLevel)} ${formattedContext} ${processedMessage}\n`,
    );
  }

  private getColor(level: LogLevel): (text: string) => string {
    switch (level) {
      case 'log':
        return clc.cyanBright;
      case 'error':
        return clc.red;
      case 'warn':
        return clc.yellow;
      case 'debug':
        return clc.magentaBright;
      case 'verbose':
        return clc.cyanBright;
      default:
        return (text: string) => text;
    }
  }

  private getTimestamp(): string {
    return clc.yellow(new Date().toLocaleString());
  }
}
