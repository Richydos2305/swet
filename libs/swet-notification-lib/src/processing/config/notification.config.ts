import { Configuration, Value } from '@itgorillaz/configify';
import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { EmailProvider } from './email-provider.enum';

const NOTIFICATION_CONFIG_PREFIX = 'swet.notification';

@Configuration()
export class NotificationConfig {
  @IsOptional()
  @IsEnum(EmailProvider)
  @Value(`${NOTIFICATION_CONFIG_PREFIX}.emailProvider`)
  emailProvider: EmailProvider;

  @IsString()
  @IsOptional()
  @Value(`${NOTIFICATION_CONFIG_PREFIX}.templatePath`, {
    default: './libs/swet-notification-lib/src/processing/template/email',
  })
  templatePath: string;

  @IsString()
  @Value(`${NOTIFICATION_CONFIG_PREFIX}.queue.host`)
  queueHost: string;

  @IsString()
  @IsOptional()
  @Value(`${NOTIFICATION_CONFIG_PREFIX}.queue.port`, { default: '5672' })
  queuePort: string;

  @IsString()
  @Value(`${NOTIFICATION_CONFIG_PREFIX}.queue.username`)
  queueUsername: string;

  @IsString()
  @Value(`${NOTIFICATION_CONFIG_PREFIX}.queue.password`)
  queuePassword: string;

  @IsUrl({ require_tld: false, protocols: ['amqp', 'amqps'] })
  @Value(`${NOTIFICATION_CONFIG_PREFIX}.queue.url`)
  rabbitmqUrl: string;

  @IsString()
  @IsOptional()
  @Value(`${NOTIFICATION_CONFIG_PREFIX}.queue.name`, {
    default: 'swet-notification',
  })
  queueName: string;

  static readonly CLIENT = 'NOTIFICATION_CLIENT';
  static readonly PATTERN = 'notification.send';
}
