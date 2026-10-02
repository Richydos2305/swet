import { Module } from '@nestjs/common';
import { AppCacheModule } from '@swet/common/core/cache/cache.module';
import { MonnifyAuthTokenService } from '../../provider/monnify/config/monnify-auth-token.service';
import { MonnifyClient } from '../../provider/monnify/config/monnify-client';
import { MonnifyBvnHandler } from './monnify-bvn.handler';
import { MonnifyNinHandler } from './monnify-nin.handler';

@Module({
  imports: [AppCacheModule],
  providers: [
    MonnifyClient,
    MonnifyAuthTokenService,
    MonnifyBvnHandler,
    MonnifyNinHandler,
  ],
})
export class MonnifyIdentityModule {}
