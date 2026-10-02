import { Injectable } from '@nestjs/common';
import { ProviderHandler } from '@swet/common/core/provider/provider-handler.decorator';
import { IProviderHandler } from '@swet/common/core/provider/provider-handler.interface';
import {
  IntegrationResponse,
  IntegrationResponseStatus,
} from '@swet/integration/core/api/integration-response';

@Injectable()
@ProviderHandler({ provider: 'DUMMY_PROVIDER', service: 'DUMMY_SERVICE' })
export class DummyProviderHandler implements IProviderHandler<
  string,
  IntegrationResponse<string>
> {
  process(request: string): Promise<IntegrationResponse<string>> {
    return Promise.resolve({
      provider: 'DUMMY_PROVIDER',
      service: 'DUMMY_SERVICE',
      status: IntegrationResponseStatus.COMPLETED,
      data: request,
    });
  }
}
