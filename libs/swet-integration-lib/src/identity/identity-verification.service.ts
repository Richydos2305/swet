import { Injectable } from '@nestjs/common';
import { IProviderHandler } from '@swet/common/core/provider/provider-handler.interface';
import { ProviderHandlerRegistry } from '@swet/common/core/provider/provider-handler.registry';
import { IntegrationConfig } from '../core/config/integration-config';
import { IntegrationResponse } from '../core/provider/integration-response';
import { VerifyBvnRequest, VerifyBvnResponse } from './dto/verify-bvn.dto';
import { VerifyNinRequest, VerifyNinResponse } from './dto/verify-nin.dto';
import { IdentityCheckType } from './identity.constant';

@Injectable()
export class IdentityVerificationService {
  constructor(
    private readonly integrationConfig: IntegrationConfig,
    private readonly registry: ProviderHandlerRegistry,
  ) {}

  verifyBvn(
    request: VerifyBvnRequest,
  ): Promise<IntegrationResponse<VerifyBvnResponse>> {
    return this.registry
      .getHandler<
        IProviderHandler<
          VerifyBvnRequest,
          IntegrationResponse<VerifyBvnResponse>
        >
      >(this.integrationConfig.identityProvider, IdentityCheckType.BVN)
      .process(request);
  }

  verifyNin(
    request: VerifyNinRequest,
  ): Promise<IntegrationResponse<VerifyNinResponse>> {
    return this.registry
      .getHandler<
        IProviderHandler<
          VerifyNinRequest,
          IntegrationResponse<VerifyNinResponse>
        >
      >(this.integrationConfig.identityProvider, IdentityCheckType.NIN)
      .process(request);
  }
}
