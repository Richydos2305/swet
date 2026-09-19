import { baseModel } from '@swet/common/modules/base/model/base-model.model';
import { TokenUtil } from '@swet/common/utils/token.util';
import { date, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import {
  AuthenticationProvider,
  authProviderPgEnum,
  KycStatus,
  kycStatusPgEnum,
} from './user-profile.enum';

export const userProfile = pgTable('user_profile', {
  ...baseModel(),
  userProfilePublicId: varchar({ length: 32 })
    .notNull()
    .unique()
    .$defaultFn(() => TokenUtil.generateIdentifier('UP')),
  username: varchar({ length: 255 }).unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  phoneNumber: varchar({ length: 255 }).unique(),
  passwordHash: varchar({ length: 255 }),
  firstName: varchar({ length: 255 }).notNull(),
  lastName: varchar({ length: 255 }).notNull(),
  dateOfBirth: date(),
  bvn: varchar({ length: 11 }).unique(),
  bvnVerifiedAt: timestamp(),
  nin: varchar({ length: 11 }).unique(),
  ninVerifiedAt: timestamp(),
  kycStatus: kycStatusPgEnum()
    .$type<KycStatus>()
    .notNull()
    .default(KycStatus.UNVERIFIED),
  authenticationProvider: authProviderPgEnum()
    .$type<AuthenticationProvider>()
    .notNull(),
  providerId: varchar({ length: 255 }).unique(),
});

export type UserProfile = typeof userProfile.$inferSelect;
export type NewUserProfile = typeof userProfile.$inferInsert;
export type UpdateUserProfile = Partial<Omit<UserProfile, 'id'>>;
