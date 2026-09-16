import { ConfigifyModule } from '@itgorillaz/configify';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterDrizzleOrm } from '@nestjs-cls/transactional-adapter-drizzle-orm';
import { Module } from '@nestjs/common';
import {
  DRIZZLE_TOKEN,
  StaticDatabaseModule,
} from '@swet/common/core/database/database.module';
import { ClsModule } from 'nestjs-cls';
import { join } from 'path';

@Module({
  imports: [
    ConfigifyModule.forRootAsync({
      configFilePath: [
        join(process.cwd(), 'apps/swet-service/swet-service-production.yml'),
        join(process.cwd(), 'apps/swet-service/swet-service-staging.yml'),
        join(process.cwd(), 'apps/swet-service/swet-service-dev.yml'),
      ],
    }),
    ClsModule.forRoot({
      global: true,
      plugins: [
        new ClsPluginTransactional({
          imports: [StaticDatabaseModule],
          adapter: new TransactionalAdapterDrizzleOrm({
            drizzleInstanceToken: DRIZZLE_TOKEN,
          }),
        }),
      ],
    }),
    StaticDatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class SwetServiceModule {}
