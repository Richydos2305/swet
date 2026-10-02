import { Injectable } from '@nestjs/common';
import { ProviderHandler } from '@swet/common/core/provider/provider-handler.decorator';
import { IProviderHandler } from '@swet/common/core/provider/provider-handler.interface';
import { IntegrationApiError } from '@swet/integration/core/api/integration-api.error';
import {
  IntegrationResponse,
  IntegrationResponseStatus,
} from '@swet/integration/core/api/integration-response';
import { MonnifyClient } from '@swet/integration/provider/monnify/config/monnify-client';
import { MonnifyConfig } from '@swet/integration/provider/monnify/config/monnify.config';
import { VerifyNinRequest, VerifyNinResponse } from '../dto/verify-nin.dto';
import { IdentityCheckType, IdentityProvider } from '../identity.constant';
import { MonnifyNinRequest, MonnifyNinResponse } from './dto/monnify-nin.dto';

@Injectable()
@ProviderHandler({
  provider: IdentityProvider.MONNIFY,
  service: IdentityCheckType.NIN,
})
export class MonnifyNinHandler implements IProviderHandler<
  VerifyNinRequest,
  IntegrationResponse<VerifyNinResponse>
> {
  constructor(private readonly monnifyClient: MonnifyClient) {}

  async process(
    request: VerifyNinRequest,
  ): Promise<IntegrationResponse<VerifyNinResponse>> {
    try {
      const monnifyRequest: MonnifyNinRequest = { nin: request.nin };

      const { data: response } = await this.monnifyClient
        .post<MonnifyNinRequest, MonnifyNinResponse>(
          MonnifyConfig.NIN_CHECK_URL,
          monnifyRequest,
        )
        .catch((error: unknown) => {
          throw IntegrationApiError.fromUnknown(
            IdentityProvider.MONNIFY,
            IdentityCheckType.NIN,
            error,
          );
        });

      if (!response.requestSuccessful) {
        return {
          provider: IdentityProvider.MONNIFY,
          service: IdentityCheckType.NIN,
          status: IntegrationResponseStatus.COMPLETED_WITH_ERROR,
          message: response.responseMessage,
        };
      }

      const body = response.responseBody;
      return {
        provider: IdentityProvider.MONNIFY,
        service: IdentityCheckType.NIN,
        status: IntegrationResponseStatus.COMPLETED,
        data: {
          nin: request.nin,
          firstName: body.firstName,
          lastName: body.lastName,
          dateOfBirth: body.dateOfBirth,
          isVerified: true,
        },
      };
    } catch (error) {
      return {
        provider: IdentityProvider.MONNIFY,
        service: IdentityCheckType.NIN,
        status: IntegrationResponseStatus.FAILED,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
