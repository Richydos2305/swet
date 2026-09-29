import { Configuration, Value } from '@itgorillaz/configify';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

const SERVICE_CONFIG_PREFIX = 'swet.service';

@Configuration()
export class ServiceConfig {
  @IsString()
  @IsOptional()
  @Value(`${SERVICE_CONFIG_PREFIX}.name`)
  name: string;

  @IsNumberString()
  @Value(`${SERVICE_CONFIG_PREFIX}.port`)
  port: number;

  @IsString()
  @IsOptional()
  @Value(`${SERVICE_CONFIG_PREFIX}.redisUrl`, {
    default: 'redis://localhost:6379',
  })
  redisUrl: string;
}
