import { TransactionHost } from '@nestjs-cls/transactional';
import { Logger } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { SYSTEM_NAME } from '../../../constant/system-constant';

/**
 * Generic base repository for Drizzle + Nest.
 *
 * TSelect: the row shape returned from SELECT (usually table.$inferSelect)
 * TInsert: the shape used for INSERT (usually table.$inferInsert)
 * TUpdate: the shape used for UPDATE (partial of select/insert)
 *
 * table: the pgTable instance
 * idColumn: the primary key column
 */
export class BaseRepository<
  TSelect extends Record<string, any>,
  TInsert extends Record<string, any>,
  TUpdate extends Record<string, any>,
  TAdapter = never,
> {
  private readonly logger = new Logger(BaseRepository.name);

  constructor(
    protected readonly table: any,
    protected readonly idColumn: any,
    protected readonly txHost: TransactionHost<TAdapter>,
    protected readonly fallbackDb: NodePgDatabase,
  ) {}

  /**
   * Use active transaction if present, otherwise fallback DB.
   */
  protected get db() {
    return (this.txHost?.tx ?? this.fallbackDb) as unknown as NodePgDatabase;
  }

  async save(data: TInsert): Promise<TSelect> {
    const auditUser = this.getAuditUser();
    const rows = (await this.db
      .insert(this.table)
      .values({ ...data, createdBy: auditUser, updatedBy: auditUser })
      .returning()
      .execute()) as TSelect[];

    return rows[0];
  }

  async saveAll(data: TInsert[]): Promise<TSelect[]> {
    const auditUser = this.getAuditUser();
    const dataWithAudit = data.map((item) => ({
      ...item,
      createdBy: auditUser,
      updatedBy: auditUser,
    }));
    return (await this.db
      .insert(this.table)
      .values(dataWithAudit)
      .returning()
      .execute()) as TSelect[];
  }

  /**
   * Update by primary key. Excludes soft-deleted rows if the table has a deleted column.
   */
  async update(
    id: string | number,
    data: Partial<TUpdate>,
  ): Promise<TSelect | null> {
    const [updated] = (await this.db
      .update(this.table)
      .set({ ...data, updatedBy: this.getAuditUser() })
      .where(this.buildWhereClause(id))
      .returning()
      .execute()) as TSelect[];

    return updated ?? null;
  }

  /**
   * Excludes soft-deleted rows if the table has a deleted column.
   */
  async findOneById(id: string | number): Promise<TSelect | undefined> {
    const [entity] = await this.db
      .select()
      .from(this.table)
      .where(this.buildWhereClause(id))
      .limit(1)
      .execute();
    return entity;
  }

  async delete(id: string | number): Promise<void> {
    await this.db
      .update(this.table)
      .set({ deleted: true, updatedBy: this.getAuditUser() })
      .where(eq(this.idColumn, id))
      .execute();
  }

  protected getAuditUser(): string {
    return SYSTEM_NAME;
  }

  protected get hasDeletedColumn(): boolean {
    return 'deleted' in this.table;
  }

  protected buildWhereClause(id: string | number) {
    if (this.hasDeletedColumn) {
      return and(eq(this.idColumn, id), eq(this.table['deleted'], false));
    }
    return eq(this.idColumn, id);
  }
}
