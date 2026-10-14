import { Configuration, Value } from '@itgorillaz/configify';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { CacheProvider } from '../core/cache/cache-provider.enum';

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

  @IsOptional()
  @IsEnum(CacheProvider)
  @Value(`${SERVICE_CONFIG_PREFIX}.cacheProvider`, {
    default: CacheProvider.REDIS,
  })
  cacheProvider: CacheProvider;

  @IsString()
  @IsOptional()
  @Value(`${SERVICE_CONFIG_PREFIX}.redisUrl`, {
    default: 'redis://localhost:6379',
  })
  redisUrl: string;
}
