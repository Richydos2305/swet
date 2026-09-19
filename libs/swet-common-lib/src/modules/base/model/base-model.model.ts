import { boolean } from 'drizzle-orm/pg-core';
import { auditable } from './auditable.model';

export function baseModel() {
  return {
    ...auditable(),
    deleted: boolean().notNull().default(false),
  };
}
