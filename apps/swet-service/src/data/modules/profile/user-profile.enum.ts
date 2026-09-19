import { DatabaseUtil } from '@swet/common/core/database/database.util';
import { pgEnum } from 'drizzle-orm/pg-core';

export enum KycStatus {
  UNVERIFIED = 'UNVERIFIED',
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export const kycStatusPgEnum = pgEnum(
  'kyc_status',
  DatabaseUtil.enumValues(KycStatus),
);

export enum AuthenticationProvider {
  EMAIL = 'EMAIL',
  GOOGLE = 'GOOGLE',
}

export const authProviderPgEnum = pgEnum(
  'authentication_provider',
  DatabaseUtil.enumValues(AuthenticationProvider),
);
