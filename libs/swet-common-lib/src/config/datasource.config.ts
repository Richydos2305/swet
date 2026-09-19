import { Configuration, Value } from '@itgorillaz/configify';
import { Optional } from '@nestjs/common';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { CommonUtil } from '../utils/common.util';

const DB_CONFIG_PREFIX = 'swet.database';

@Configuration()
export class DatasourceConfig {
  @IsString()
  @Value(`${DB_CONFIG_PREFIX}.url`)
  url: string;

  @IsString()
  @Value(`${DB_CONFIG_PREFIX}.name`)
  name: string;

  @IsString()
  @Value(`${DB_CONFIG_PREFIX}.username`)
  username: string;

  @IsString()
  @Value(`${DB_CONFIG_PREFIX}.password`)
  password: string;

  @Optional()
  @IsBoolean()
  @Value(`${DB_CONFIG_PREFIX}.logger`, {
    default: 'false',
    parse: CommonUtil.PARSE_BOOLEAN_STRING,
  })
  logger: boolean;

  @Optional()
  @IsBoolean()
  @Value(`${DB_CONFIG_PREFIX}.ssl`, {
    default: 'true',
    parse: CommonUtil.PARSE_BOOLEAN_STRING,
  })
  ssl: boolean;

  @IsString()
  @IsOptional()
  @Value(`${DB_CONFIG_PREFIX}.migrationBasePath`)
  migrationBasePath?: string;

  @IsString()
  @Value(`${DB_CONFIG_PREFIX}.baseModelPath`)
  baseModelPath: string;

  @IsNumber()
  @IsOptional()
  @Value(`${DB_CONFIG_PREFIX}.poolMax`, { default: 10 })
  poolMax: number = 10;
}
