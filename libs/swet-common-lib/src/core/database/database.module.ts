import { Global, Module } from '@nestjs/common';
import { DatabaseConfig } from './database.config';

export const DRIZZLE_TOKEN = Symbol('SWET_DRIZZLE_CLIENT');

@Global()
@Module({
  providers: [
    DatabaseConfig,
    {
      provide: DRIZZLE_TOKEN,
      useFactory: (databaseConfig: DatabaseConfig) =>
        databaseConfig.getDatabase(),
      inject: [DatabaseConfig],
    },
  ],
  exports: [DRIZZLE_TOKEN, DatabaseConfig],
})
export class StaticDatabaseModule {}
