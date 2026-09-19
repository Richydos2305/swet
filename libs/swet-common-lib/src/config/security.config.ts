import { Configuration, Value } from '@itgorillaz/configify';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CommonUtil } from '../utils/common.util';

const SECURITY_CONFIG_PREFIX = 'swet.security';

@Configuration()
export class SecurityConfig {
  @IsString()
  @Value(`${SECURITY_CONFIG_PREFIX}.jwtKey`)
  jwtKey: string;

  @IsNumber()
  @IsOptional()
  @Value(`${SECURITY_CONFIG_PREFIX}.jwtExpiresInSeconds`, { default: 3600 })
  jwtExpiresInSeconds: number;

  @Value(`${SECURITY_CONFIG_PREFIX}.allowedOrigins`, {
    default: [],
    parse: CommonUtil.PARSE_LIST,
  })
  allowedOrigins: string[];

  @Value(`${SECURITY_CONFIG_PREFIX}.allowedMethods`, {
    default: [],
    parse: CommonUtil.PARSE_LIST,
  })
  allowedMethods: string[];

  @Value(`${SECURITY_CONFIG_PREFIX}.exposedHeaders`, {
    default: [],
    parse: CommonUtil.PARSE_LIST,
  })
  @IsOptional()
  exposedHeaders: string[];

  @IsString()
  @Value(`${SECURITY_CONFIG_PREFIX}.googleClientId`)
  googleClientId: string;

  @IsNumber()
  @Value(`${SECURITY_CONFIG_PREFIX}.otpTtlSeconds`, { default: 900 })
  otpTtlSeconds: number;

  @IsNumber()
  @Value(`${SECURITY_CONFIG_PREFIX}.otpAttempts`, { default: 5 })
  otpAttempts: number;

  static readonly GOOGLE_ACCEPTED_ISSUERS = [
    'accounts.google.com',
    'https://accounts.google.com',
  ];
}
