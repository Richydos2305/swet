import { ConfigifyModule } from '@itgorillaz/configify';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterDrizzleOrm } from '@nestjs-cls/transactional-adapter-drizzle-orm';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalExceptionFilter } from '@swet/common/core/api/filter/global-exception.filter';
import { ResponseTransformInterceptor } from '@swet/common/core/api/interceptor/response-transform.interceptor';
import {
  DRIZZLE_TOKEN,
  StaticDatabaseModule,
} from '@swet/common/core/database/database.module';
import { ClsModule } from 'nestjs-cls';
import { join } from 'path';
import { AuthenticationModule } from './service/modules/authentication/authentication.module';
import { OnboardingModule } from './service/modules/onboarding/onboarding.module';

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
    AuthenticationModule,
    OnboardingModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformInterceptor,
    },
  ],
})
export class SwetServiceModule {}
