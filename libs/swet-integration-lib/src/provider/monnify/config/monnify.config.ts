import { Configuration, Value } from '@itgorillaz/configify';
import { IsString, IsUrl } from 'class-validator';

const MONNIFY_CONFIG_PREFIX = 'swet.integration.providers.monnify';

@Configuration()
export class MonnifyConfig {
  @IsString()
  @Value(`${MONNIFY_CONFIG_PREFIX}.apiKey`)
  apiKey: string;

  @IsString()
  @Value(`${MONNIFY_CONFIG_PREFIX}.secretKey`)
  secretKey: string;

  @IsUrl({ require_tld: false })
  @Value(`${MONNIFY_CONFIG_PREFIX}.baseUrl`, {
    default: 'https://sandbox.monnify.com',
  })
  baseUrl: string;

  static readonly LOGIN_URL = '/api/v1/auth/login';
  static readonly BVN_CHECK_URL = '/api/v1/vas/bvn-details-match';
  static readonly NIN_CHECK_URL = '/api/v1/vas/nin-details';

  static readonly MONNIFY_ACCESS_TOKEN_CACHE_KEY = 'monnify-access-token';
  static readonly MONNIFY_ACCESS_TOKEN_EXPIRY_SAFETY_MARGIN_SECONDS = 60;
}
