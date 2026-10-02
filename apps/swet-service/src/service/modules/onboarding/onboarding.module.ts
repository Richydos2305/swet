import { Module } from '@nestjs/common';
import { AppCacheModule } from '@swet/common/core/cache/cache.module';
import { NotificationService } from '@swet/common/core/notification/notification.service';
import { OtpService } from '@swet/common/modules/otp/otp.service';
import { IdentityVerificationModule } from '@swet/integration/identity/identity-verification.module';
import { UserProfileModule } from '../profile/user-profile.module';
import { OnboardingController } from './onboarding.controller';
import { OnboardingService } from './onboarding.service';

@Module({
  imports: [UserProfileModule, AppCacheModule, IdentityVerificationModule],
  controllers: [OnboardingController],
  providers: [OnboardingService, OtpService, NotificationService],
})
export class OnboardingModule {}
