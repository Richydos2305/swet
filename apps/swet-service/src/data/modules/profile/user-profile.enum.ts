import { pgEnum } from 'drizzle-orm/pg-core';

export const kycStatusPgEnum = pgEnum('kyc_status', [
  'UNVERIFIED',
  'PENDING',
  'VERIFIED',
  'REJECTED',
]);

export type KycStatus = (typeof kycStatusPgEnum.enumValues)[number];
