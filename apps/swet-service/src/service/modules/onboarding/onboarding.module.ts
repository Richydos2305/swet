import { Module } from '@nestjs/common';
import { RedisCacheModule } from '@swet/common/core/cache/redis-cache.module';
import { NotificationService } from '@swet/common/core/notification/notification.service';
import { OtpService } from '@swet/common/modules/otp/otp.service';
import { UserProfileModule } from '../profile/user-profile.module';
import { OnboardingController } from './onboarding.controller';
import { OnboardingService } from './onboarding.service';

@Module({
  imports: [UserProfileModule, RedisCacheModule],
  controllers: [OnboardingController],
  providers: [OnboardingService, OtpService, NotificationService],
})
export class OnboardingModule {}
