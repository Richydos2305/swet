import { TransactionHost } from '@nestjs-cls/transactional';
import { Inject, Injectable } from '@nestjs/common';
import type { DrizzleAdapter } from '@swet/common/core/database/database.config';
import { DRIZZLE_TOKEN } from '@swet/common/core/database/database.module';
import { BaseRepository } from '@swet/common/modules/base/repository/base.repository';
import { and, eq, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import {
  NewUserProfile,
  UpdateUserProfile,
  UserProfile,
  userProfile,
} from './user-profile.model';

@Injectable()
export class UserProfileRepository extends BaseRepository<
  UserProfile,
  NewUserProfile,
  UpdateUserProfile,
  DrizzleAdapter
> {
  constructor(
    txHost: TransactionHost<DrizzleAdapter>,
    @Inject(DRIZZLE_TOKEN) fallbackDb: NodePgDatabase,
  ) {
    super(userProfile, userProfile.id, txHost, fallbackDb);
  }

  async findOneByEmail(email: string): Promise<UserProfile | undefined> {
    const [result] = await this.db
      .select()
      .from(userProfile)
      .where(
        and(
          sql`LOWER(${userProfile.email}) = LOWER(${email.trim()})`,
          eq(userProfile.deleted, false),
        ),
      )
      .limit(1);
    return result;
  }

  async findOneByUsername(username: string): Promise<UserProfile | undefined> {
    const [result] = await this.db
      .select()
      .from(userProfile)
      .where(
        and(
          sql`LOWER(${userProfile.username}) = LOWER(${username.trim()})`,
          eq(userProfile.deleted, false),
        ),
      )
      .limit(1);
    return result;
  }

  async findOneByProviderId(
    providerId: string,
  ): Promise<UserProfile | undefined | null> {
    const [result] = await this.db
      .select()
      .from(userProfile)
      .where(
        and(
          eq(userProfile.providerId, providerId),
          eq(userProfile.deleted, false),
        ),
      )
      .limit(1);
    return result;
  }
}
