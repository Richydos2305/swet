import { IntegrationResponseStatus } from '@swet/integration/core/api/integration-response';
import { MatchResult } from '@swet/integration/identity/dto/match-result.enum';
import { MockBvnHandler } from '@swet/integration/identity/mock/mock-bvn.handler';
import { MockIdentityGenerator } from '@swet/integration/identity/mock/mock-identity.generator';

describe('MockBvnHandler', () => {
  const handler = new MockBvnHandler();
  const bvn = '12345678901';
  const record = MockIdentityGenerator.generate(bvn);

  it('returns full matches and isVerified when every supplied field matches the generated record', async () => {
    const result = await handler.process({
      bvn,
      name: `${record.firstName} ${record.lastName}`,
      dateOfBirth: record.dateOfBirth,
      phone: record.phone,
    });

    expect(result.status).toBe(IntegrationResponseStatus.COMPLETED);
    expect(result.data).toEqual({
      bvn,
      nameMatch: MatchResult.FULL_MATCH,
      dateOfBirthMatch: MatchResult.FULL_MATCH,
      mobileNoMatch: MatchResult.FULL_MATCH,
      isVerified: true,
    });
  });

  it('is deterministic for the same bvn and inputs', async () => {
    const request = {
      bvn,
      name: `${record.firstName} ${record.lastName}`,
      dateOfBirth: record.dateOfBirth,
      phone: record.phone,
    };

    expect(await handler.process(request)).toEqual(
      await handler.process(request),
    );
  });

  it('returns a partial name match when only part of the name matches', async () => {
    const result = await handler.process({
      bvn,
      name: `${record.firstName} Wrongname`,
    });

    expect(result.data?.nameMatch).toBe(MatchResult.PARTIAL_MATCH);
    expect(result.data?.isVerified).toBe(false);
  });

  it('returns no match for fields that are wrong or missing', async () => {
    const result = await handler.process({ bvn, phone: '08000000000' });

    expect(result.data).toMatchObject({
      nameMatch: MatchResult.NO_MATCH,
      dateOfBirthMatch: MatchResult.NO_MATCH,
      mobileNoMatch: MatchResult.NO_MATCH,
      isVerified: false,
    });
  });

  it('returns COMPLETED_WITH_ERROR for a bvn ending in 0000', async () => {
    const result = await handler.process({ bvn: '12345670000' });

    expect(result.status).toBe(IntegrationResponseStatus.COMPLETED_WITH_ERROR);
    expect(result.data).toBeUndefined();
  });
});
