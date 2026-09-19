import { TokenUtil } from '@swet/common/utils/token.util';
import { timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export function auditable() {
  return {
    id: uuid()
      .primaryKey()
      .$defaultFn(() => TokenUtil.generateTimeSortableIdentifier()),
    createdAt: timestamp().notNull().defaultNow(),
    createdBy: varchar(),
    updatedAt: timestamp().notNull().defaultNow(),
    updatedBy: varchar(),
  };
}
