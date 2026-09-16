import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

type DrizzleClient = ReturnType<typeof drizzle>;

export class PoolFactory {
  static createFromUrl(
    connectionString: string,
    ssl: boolean,
    max?: number,
  ): Pool {
    return new Pool({
      connectionString,
      ssl,
      max: max ?? 10,
    });
  }

  static async testConnection(pool: Pool): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query('SELECT 1');
    } finally {
      client.release();
    }
  }
}

export interface DrizzleOptions {
  enableLogging?: boolean;
}

export class DrizzleFactory {
  static create(pool: Pool, options?: DrizzleOptions): DrizzleClient {
    return drizzle(pool, {
      casing: 'snake_case',
      logger: options?.enableLogging ? this.createLogger() : undefined,
    });
  }

  private static createLogger() {
    return {
      logQuery: (query: string, params: unknown[]): void => {
        const formattedQuery = params.reduce<string>(
          (sql, param, index) =>
            sql.replace(`$${index + 1}`, JSON.stringify(param)),
          query,
        );
        console.log(`\nSQL: ${formattedQuery}\n`);
      },
    };
  }
}
