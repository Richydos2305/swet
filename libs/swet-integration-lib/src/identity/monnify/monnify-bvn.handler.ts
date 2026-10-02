import { Injectable } from '@nestjs/common';
import { ProviderHandler } from '@swet/common/core/provider/provider-handler.decorator';
import { IProviderHandler } from '@swet/common/core/provider/provider-handler.interface';
import { DateUtil } from '@swet/common/utils/date.util';
import { IntegrationApiError } from '@swet/integration/core/api/integration-api.error';
import {
  IntegrationResponse,
  IntegrationResponseStatus,
} from '@swet/integration/core/api/integration-response';
import { MonnifyClient } from '@swet/integration/provider/monnify/config/monnify-client';
import { MonnifyConfig } from '@swet/integration/provider/monnify/config/monnify.config';
import { MatchResult } from '../dto/match-result.enum';
import { VerifyBvnRequest, VerifyBvnResponse } from '../dto/verify-bvn.dto';
import { IdentityCheckType, IdentityProvider } from '../identity.constant';
import { MonnifyBvnRequest, MonnifyBvnResponse } from './dto/monnify-bvn.dto';

@Injectable()
@ProviderHandler({
  provider: IdentityProvider.MONNIFY,
  service: IdentityCheckType.BVN,
})
export class MonnifyBvnHandler implements IProviderHandler<
  VerifyBvnRequest,
  IntegrationResponse<VerifyBvnResponse>
> {
  constructor(private readonly monnifyClient: MonnifyClient) {}

  async process(
    request: VerifyBvnRequest,
  ): Promise<IntegrationResponse<VerifyBvnResponse>> {
    try {
      const monnifyRequest: MonnifyBvnRequest = {
        bvn: request.bvn,
        name: request.name,
        dateOfBirth: DateUtil.toDDMMMYYYY(request.dateOfBirth),
        mobileNo: request.phone,
      };

      const { data: response } = await this.monnifyClient
        .post<MonnifyBvnRequest, MonnifyBvnResponse>(
          MonnifyConfig.BVN_CHECK_URL,
          monnifyRequest,
        )
        .catch((error: unknown) => {
          throw IntegrationApiError.fromUnknown(
            IdentityProvider.MONNIFY,
            IdentityCheckType.BVN,
            error,
          );
        });

      if (!response.requestSuccessful) {
        return {
          provider: IdentityProvider.MONNIFY,
          service: IdentityCheckType.BVN,
          status: IntegrationResponseStatus.COMPLETED_WITH_ERROR,
          message: response.responseMessage,
        };
      }

      const body = response.responseBody;
      const nameMatch = MonnifyBvnResponse.toMatchResult(body.name.matchStatus);
      const dateOfBirthMatch = MonnifyBvnResponse.toMatchResult(
        body.dateOfBirth,
      );
      const mobileNoMatch = MonnifyBvnResponse.toMatchResult(body.mobileNo);

      return {
        provider: IdentityProvider.MONNIFY,
        service: IdentityCheckType.BVN,
        status: IntegrationResponseStatus.COMPLETED,
        data: {
          bvn: request.bvn,
          nameMatch,
          dateOfBirthMatch,
          mobileNoMatch,
          isVerified: [nameMatch, dateOfBirthMatch, mobileNoMatch].every(
            (result) => result === MatchResult.FULL_MATCH,
          ),
        },
      };
    } catch (error) {
      return {
        provider: IdentityProvider.MONNIFY,
        service: IdentityCheckType.BVN,
        status: IntegrationResponseStatus.FAILED,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
