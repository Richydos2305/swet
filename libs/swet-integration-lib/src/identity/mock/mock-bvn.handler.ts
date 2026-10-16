import { Injectable, Logger } from '@nestjs/common';
import { ProviderHandler } from '@swet/common/core/provider/provider-handler.decorator';
import { IProviderHandler } from '@swet/common/core/provider/provider-handler.interface';
import {
  IntegrationResponse,
  IntegrationResponseStatus,
} from '@swet/integration/core/api/integration-response';
import { MatchResult } from '../dto/match-result.enum';
import { VerifyBvnRequest, VerifyBvnResponse } from '../dto/verify-bvn.dto';
import { IdentityCheckType, IdentityProvider } from '../identity.constant';
import { MockIdentityGenerator } from './mock-identity.generator';

@Injectable()
@ProviderHandler({
  provider: IdentityProvider.MOCK,
  service: IdentityCheckType.BVN,
})
export class MockBvnHandler implements IProviderHandler<
  VerifyBvnRequest,
  IntegrationResponse<VerifyBvnResponse>
> {
  private readonly logger = new Logger(MockBvnHandler.name);

  async process(
    request: VerifyBvnRequest,
  ): Promise<IntegrationResponse<VerifyBvnResponse>> {
    if (MockIdentityGenerator.isNotFound(request.bvn)) {
      return {
        provider: IdentityProvider.MOCK,
        service: IdentityCheckType.BVN,
        status: IntegrationResponseStatus.COMPLETED_WITH_ERROR,
        message: 'No record found for the supplied BVN',
      };
    }

    const record = MockIdentityGenerator.generate(request.bvn);
    const registeredName = `${record.firstName} ${record.lastName}`;

    this.logger.debug(
      `Mock BVN record for ${request.bvn}: ${JSON.stringify(record)}`,
    );

    const nameMatch = MockBvnHandler.matchName(request.name, registeredName);

    const dateOfBirthMatch = MockBvnHandler.matchExact(
      request.dateOfBirth,
      record.dateOfBirth,
    );

    const mobileNoMatch = MockBvnHandler.matchExact(
      request.phone,
      record.phone,
    );

    return {
      provider: IdentityProvider.MOCK,
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
  }

  private static matchExact(
    supplied: string | undefined,
    truth: string,
  ): MatchResult {
    if (!supplied) return MatchResult.NO_MATCH;

    return supplied === truth ? MatchResult.FULL_MATCH : MatchResult.NO_MATCH;
  }

  private static matchName(
    supplied: string | undefined,
    truth: string,
  ): MatchResult {
    if (!supplied) {
      return MatchResult.NO_MATCH;
    }
    const suppliedParts = supplied.toLowerCase().split(/\s+/).filter(Boolean);
    const truthParts = truth.toLowerCase().split(/\s+/);
    const matchCount = suppliedParts.filter((part) =>
      truthParts.includes(part),
    ).length;

    if (matchCount === truthParts.length) return MatchResult.FULL_MATCH;

    if (matchCount > 0) return MatchResult.PARTIAL_MATCH;

    return MatchResult.NO_MATCH;
  }
}
