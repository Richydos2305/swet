import { Configuration, Value } from '@itgorillaz/configify';
import { IdentityProvider } from '@swet/integration/identity/identity.constant';
import { IsEnum } from 'class-validator';

const INTEGRATION_CONFIG_PREFIX = 'swet.integration';

@Configuration()
export class IntegrationConfig {
  @IsEnum(IdentityProvider)
  @Value(`${INTEGRATION_CONFIG_PREFIX}.provider`, {
    default: IdentityProvider.MONNIFY,
  })
  identityProvider: IdentityProvider;
}
