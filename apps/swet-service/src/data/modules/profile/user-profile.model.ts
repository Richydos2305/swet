import { baseModel } from '@swet/common/modules/base/model/base-model.model';
import { TokenUtil } from '@swet/common/utils/token.util';
import { date, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { KycStatus, kycStatusPgEnum } from './user-profile.enum';

export const userProfile = pgTable('user_profile', {
  ...baseModel(),
  userProfilePublicId: varchar({ length: 32 })
    .notNull()
    .unique()
    .$defaultFn(() => TokenUtil.generateIdentifier('UP')),
  username: varchar().notNull().unique(),
  email: varchar().notNull().unique(),
  phoneNumber: varchar().notNull().unique(),
  passwordHash: varchar().notNull(),
  firstName: varchar().notNull(),
  lastName: varchar().notNull(),
  dateOfBirth: date(),
  bvn: varchar({ length: 11 }).unique(),
  bvnVerifiedAt: timestamp(),
  nin: varchar({ length: 11 }).unique(),
  ninVerifiedAt: timestamp(),
  kycStatus: kycStatusPgEnum()
    .$type<KycStatus>()
    .notNull()
    .default('UNVERIFIED'),
});

export type UserProfile = typeof userProfile.$inferSelect;
export type NewUserProfile = typeof userProfile.$inferInsert;
export type UpdateUserProfile = Partial<Omit<UserProfile, 'id'>>;
