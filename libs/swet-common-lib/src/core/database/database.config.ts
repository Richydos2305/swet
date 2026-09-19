import { TransactionalAdapterDrizzleOrm } from '@nestjs-cls/transactional-adapter-drizzle-orm';
import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { DatasourceConfig } from '../../config/datasource.config';
import { DrizzleFactory, PoolFactory } from './database-pool-factory';

@Injectable()
export class DatabaseConfig implements OnApplicationShutdown {
  private readonly logger = new Logger(DatabaseConfig.name);
  private readonly db: ReturnType<typeof drizzle>;
  private readonly pool: Pool;

  constructor(private readonly datasourceConfig: DatasourceConfig) {
    this.pool = PoolFactory.createFromUrl(
      this.datasourceConfig.url,
      this.datasourceConfig.ssl,
      this.datasourceConfig.poolMax,
    );

    this.db = DrizzleFactory.create(this.pool, {
      enableLogging: datasourceConfig.logger,
    });
  }

  getDatabase(): ReturnType<typeof drizzle> {
    return this.db;
  }

  async testConnection(): Promise<void> {
    try {
      await PoolFactory.testConnection(this.pool);
      this.logger.log('Database connected successfully');
    } catch (error) {
      this.logger.error('Database connection failed:', error);
      throw error;
    }
  }

  async onApplicationShutdown(signal: string) {
    this.logger.warn(`App shutting down due to ${signal}. Closing DB pool...`);
    await this.pool.end();
    this.logger.log('DB pool closed.');
  }
}

type DrizzleClient = ReturnType<typeof drizzle>;
export type DrizzleAdapter = TransactionalAdapterDrizzleOrm<DrizzleClient>;
