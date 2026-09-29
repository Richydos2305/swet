import { ConflictException, Injectable } from '@nestjs/common';
import { SecurityConfig } from '@swet/common/config/security.config';
import { NotificationService } from '@swet/common/core/notification/notification.service';
import { OtpPurpose } from '@swet/common/modules/otp/otp-purpose.enum';
import { OtpService } from '@swet/common/modules/otp/otp.service';
import { TokenUtil } from '@swet/common/utils/token.util';
import { AuthenticationProvider } from 'apps/swet-service/src/data/modules/profile/user-profile.enum';
import { UserProfileRepository } from 'apps/swet-service/src/data/modules/profile/user-profile.repository';
import { CompleteEmailValidationDTO } from './dto/complete-email-validation.dto';
import { InitiateEmailValidationDTO } from './dto/initiate-email-validation.dto';
import { OnboardingDTO } from './dto/onboarding.dto';

@Injectable()
export class OnboardingService {
  constructor(
    private readonly otpService: OtpService,
    private readonly securityConfig: SecurityConfig,
    private readonly notificationService: NotificationService,
    private readonly userProfileRepository: UserProfileRepository,
  ) {}

  async initiateEmailValidation(request: InitiateEmailValidationDTO) {
    const emailExists = await this.userProfileRepository.findOneByEmail(
      request.email,
    );

    if (emailExists) return; // FIXME: possible enumeration by timing

    const { code } = await this.otpService.keep({
      purpose: OtpPurpose.EMAIL_VALIDATION,
      requestedBy: request.email,
    });

    await this.notificationService.sendEmail(
      request.email,
      'Verify your email',
      `Your verification code is ${code}`,
    );

    return;
  }

  async completeEmailValidation(request: CompleteEmailValidationDTO) {
    await this.otpService.verify({
      purpose: OtpPurpose.EMAIL_VALIDATION,
      requestedBy: request.email,
      code: request.code,
    });

    const { code: verificationCode } = await this.otpService.keep({
      purpose: OtpPurpose.REGISTRATION_CODE,
      requestedBy: request.email,
    });

    return { verificationCode };
  }

  async createUserProfile(request: OnboardingDTO) {
    await this.otpService.verify({
      purpose: OtpPurpose.REGISTRATION_CODE,
      requestedBy: request.email,
      code: request.verificationCode,
      ttlSeconds: this.securityConfig.otpTtlSeconds,
    });

    const [existingByEmail, existingByUsername] = await Promise.all([
      this.userProfileRepository.findOneByEmail(request.email),
      this.userProfileRepository.findOneByUsername(request.username),
    ]);

    if (existingByEmail) {
      throw new ConflictException(`${request.email} is already registered`);
    }

    if (existingByUsername) {
      throw new ConflictException(`${request.username} is already taken`);
    }

    const profile = await this.userProfileRepository.save({
      email: request.email,
      username: request.username,
      phoneNumber: request.phoneNumber,
      firstName: request.firstName,
      lastName: request.lastName,
      passwordHash: await TokenUtil.createHashString(request.password),
      authenticationProvider: AuthenticationProvider.EMAIL,
    });

    return {
      userProfilePublicId: profile.userProfilePublicId,
      email: profile.email,
      username: profile.username,
    };
  }
}
