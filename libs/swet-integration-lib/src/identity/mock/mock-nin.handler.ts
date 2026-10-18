import { Injectable } from '@nestjs/common';
import { ProviderHandler } from '@swet/common/core/provider/provider-handler.decorator';
import { IProviderHandler } from '@swet/common/core/provider/provider-handler.interface';
import {
  IntegrationResponse,
  IntegrationResponseStatus,
} from '@swet/integration/core/api/integration-response';
import { VerifyNinRequest, VerifyNinResponse } from '../dto/verify-nin.dto';
import { IdentityCheckType, IdentityProvider } from '../identity.constant';
import { MockIdentityGenerator } from './mock-identity.generator';

@Injectable()
@ProviderHandler({
  provider: IdentityProvider.MOCK,
  service: IdentityCheckType.NIN,
})
export class MockNinHandler implements IProviderHandler<
  VerifyNinRequest,
  IntegrationResponse<VerifyNinResponse>
> {
  async process(
    request: VerifyNinRequest,
  ): Promise<IntegrationResponse<VerifyNinResponse>> {
    if (MockIdentityGenerator.isNotFound(request.nin)) {
      return {
        provider: IdentityProvider.MOCK,
        service: IdentityCheckType.NIN,
        status: IntegrationResponseStatus.COMPLETED_WITH_ERROR,
        message: 'No record found for the supplied NIN',
      };
    }

    const { firstName, lastName, dateOfBirth } = MockIdentityGenerator.generate(
      request.nin,
    );

    return {
      provider: IdentityProvider.MOCK,
      service: IdentityCheckType.NIN,
      status: IntegrationResponseStatus.COMPLETED,
      data: {
        nin: request.nin,
        firstName,
        lastName,
        dateOfBirth,
        isVerified: true,
      },
    };
  }
}
