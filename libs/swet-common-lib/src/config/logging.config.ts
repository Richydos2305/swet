import { Configuration, Value } from '@itgorillaz/configify';
import { IsOptional } from 'class-validator';

const LOGGING_CONFIG_PREFIX = 'swet.logging';

@Configuration()
export class LoggerConfig {
  @Value(`${LOGGING_CONFIG_PREFIX}.level`, { default: 'info' })
  level: string;

  @IsOptional()
  @Value(`${LOGGING_CONFIG_PREFIX}.consoleLevel`)
  consoleLevel: string;

  @IsOptional()
  @Value(`${LOGGING_CONFIG_PREFIX}.fileLevel`)
  fileLevel: string;

  @IsOptional()
  @Value(`${LOGGING_CONFIG_PREFIX}.logsDir`, { default: '.tmp/logs' })
  logsDir: string;

  @IsOptional()
  @Value(`${LOGGING_CONFIG_PREFIX}.maxFiles`, { default: '14d' })
  maxFiles: string;

  @IsOptional()
  @Value(`${LOGGING_CONFIG_PREFIX}.rotateSize`, { default: '20m' })
  rotateSize: string;
}
