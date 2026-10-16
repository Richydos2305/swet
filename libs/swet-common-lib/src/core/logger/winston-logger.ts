import { LoggerService } from '@nestjs/common';
import { LoggerConfig } from '@swet/common/config/logging.config';
import { mkdirSync } from 'fs';
import { WinstonModule } from 'nest-winston';
import { join } from 'path';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

function stringifyLogContext(rawContext: unknown): string | undefined {
  if (typeof rawContext === 'string') return rawContext;

  if (rawContext != null) return JSON.stringify(rawContext, null, 2);

  return undefined;
}

function stringifyLogMessage(rawMessage: unknown): string {
  if (rawMessage instanceof Error) return rawMessage.message;

  if (typeof rawMessage === 'object' && rawMessage !== null) {
    return JSON.stringify(rawMessage, null, 2);
  }

  return String(rawMessage);
}

function stringifyLogStack(rawStack: unknown): string | undefined {
  if (rawStack instanceof Error) return rawStack.stack;

  if (typeof rawStack === 'object' && rawStack !== null) {
    return JSON.stringify(rawStack, null, 2);
  }

  if (typeof rawStack === 'string') return rawStack;

  return undefined;
}

export function createWinstonLogger(
  serviceName: string,
  loggerConfig: LoggerConfig,
): LoggerService {
  serviceName = serviceName.toUpperCase();

  const prefixFormat = winston.format((info) => {
    info.message = `[${serviceName}] ${String(info.message)}`;
    return info;
  });

  const logsDir = join(loggerConfig.logsDir, serviceName.toLowerCase());
  mkdirSync(logsDir, { recursive: true });

  return WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        level: loggerConfig.consoleLevel || loggerConfig.level,
        format: winston.format.combine(
          winston.format.timestamp(),

          winston.format.colorize({
            all: true,
            colors: { info: 'green', error: 'red', debug: 'yellow' },
          }),

          winston.format.printf((info) => {
            const timestamp = info.timestamp as string;
            const level = info.level;
            const context = stringifyLogContext(info.context);
            const message = stringifyLogMessage(info.message);
            const stack = stringifyLogStack(info.stack);

            const contextIsInline = context != null && context.startsWith('{');
            const contextSegment =
              context && !contextIsInline ? ` [${context}]` : '';

            let output = `[${serviceName}] ${timestamp} [${level}]${contextSegment}: ${message}`;

            if (contextIsInline) output += `\n${context}`;

            if (stack) output += `\n${stack}`;

            return output;
          }),
        ),
      }),

      new winston.transports.DailyRotateFile({
        dirname: logsDir,
        filename: `${serviceName.toLowerCase()}-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: loggerConfig.rotateSize,
        maxFiles: loggerConfig.maxFiles,
        level: loggerConfig.fileLevel || loggerConfig.level,
        format: winston.format.combine(
          prefixFormat(),
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
    ],
  });
}
