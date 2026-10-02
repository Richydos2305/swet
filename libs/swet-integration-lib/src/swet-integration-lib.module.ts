import { Module } from '@nestjs/common';
import { IdentityVerificationModule } from './identity/identity-verification.module';

@Module({
  imports: [IdentityVerificationModule],
  exports: [IdentityVerificationModule],
})
export class SwetIntegrationLibModule {}
