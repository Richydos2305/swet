import { Configuration, Value } from '@itgorillaz/configify';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

const SWAGGER_CONFIG_PREFIX = 'swet.swagger';

@Configuration()
export class SwaggerConfig {
  @IsString()
  @Value(`${SWAGGER_CONFIG_PREFIX}.title`, {
    default: 'Smart Wallet Expense Tracker Service API',
  })
  title: string;

  @IsString()
  @Value(`${SWAGGER_CONFIG_PREFIX}.description`, {
    default: 'API documentation for the Smart Wallet Expense Tracker service',
  })
  description: string;

  @IsString()
  @Value(`${SWAGGER_CONFIG_PREFIX}.version`, { default: '1.0' })
  version: string;

  @IsString()
  @Value(`${SWAGGER_CONFIG_PREFIX}.path`, {
    default: 'documentation/swagger-ui',
  })
  path: string;

  @IsOptional()
  @IsBoolean()
  @Value(`${SWAGGER_CONFIG_PREFIX}.enabled`, { default: true })
  enabled: boolean;
}
