import { Configuration, Value } from '@itgorillaz/configify';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

const MAILJET_CONFIG_PREFIX = 'swet.notification.providers.mailjet';

@Configuration()
export class MailjetConfig {
  @IsString()
  @Value(`${MAILJET_CONFIG_PREFIX}.apiKey`)
  apiKey: string;

  @IsString()
  @Value(`${MAILJET_CONFIG_PREFIX}.apiSecret`)
  apiSecret: string;

  @IsEmail()
  @Value(`${MAILJET_CONFIG_PREFIX}.fromEmail`)
  fromEmail: string;

  @IsString()
  @IsOptional()
  @Value(`${MAILJET_CONFIG_PREFIX}.fromName`, { default: 'swet no-reply' })
  fromName: string;

  @IsUrl({ require_tld: false })
  @Value(`${MAILJET_CONFIG_PREFIX}.baseUrl`, {
    default: 'https://api.mailjet.com',
  })
  baseUrl: string;

  @IsBoolean()
  @Value(`${MAILJET_CONFIG_PREFIX}.sandboxMode`, { default: false })
  sandboxMode: boolean;

  static readonly SEND_URL = '/v3.1/send';
  static readonly HTTP_CLIENT = 'mailjet';
}
