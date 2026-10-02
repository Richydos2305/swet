import { Module } from '@nestjs/common';
import { ProviderModule } from '@swet/common/core/provider/provider.module';
import { IdentityVerificationService } from './identity-verification.service';
import { MonnifyIdentityModule } from './monnify/monnify-identity.module';

@Module({
  imports: [ProviderModule, MonnifyIdentityModule],
  providers: [IdentityVerificationService],
  exports: [IdentityVerificationService],
})
export class IdentityVerificationModule {}
