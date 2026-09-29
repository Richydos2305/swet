import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { API_V1 } from '@swet/common/constant/api-constant';
import {
  COMPLETE_API,
  INITIATE_API,
  REGISTER_API,
} from '@swet/common/constant/swagger/common-swagger.constant';
import {
  EMAIL_VALIDATION_API,
  EMAIL_VALIDATION_COMPLETE_DESCRIPTION,
  EMAIL_VALIDATION_COMPLETE_TITLE,
  EMAIL_VALIDATION_INITIATE_DESCRIPTION,
  EMAIL_VALIDATION_INITIATE_TITLE,
  ONBOARDING_API,
  ONBOARDING_MODULE_TITLE,
  REGISTER_DESCRIPTION,
  REGISTER_TITLE,
} from '@swet/common/constant/swagger/onboarding-swagger.constant';
import { ResponseMessage } from '@swet/common/core/api/decorator/response-message.decorator';
import { CompleteEmailValidationDTO } from './dto/complete-email-validation.dto';
import { InitiateEmailValidationDTO } from './dto/initiate-email-validation.dto';
import { OnboardingDTO } from './dto/onboarding.dto';
import { OnboardingService } from './onboarding.service';

@Controller(API_V1 + ONBOARDING_API)
@ApiTags(ONBOARDING_MODULE_TITLE)
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post(EMAIL_VALIDATION_API + INITIATE_API)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: EMAIL_VALIDATION_INITIATE_TITLE,
    description: EMAIL_VALIDATION_INITIATE_DESCRIPTION,
  })
  @ResponseMessage('A verification code has been sent to your email')
  initiateEmailValidation(@Body() request: InitiateEmailValidationDTO) {
    return this.onboardingService.initiateEmailValidation(request);
  }

  @Post(EMAIL_VALIDATION_API + COMPLETE_API)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: EMAIL_VALIDATION_COMPLETE_TITLE,
    description: EMAIL_VALIDATION_COMPLETE_DESCRIPTION,
  })
  @ResponseMessage('Email validated successfully')
  completeEmailValidation(@Body() request: CompleteEmailValidationDTO) {
    return this.onboardingService.completeEmailValidation(request);
  }

  @Post(REGISTER_API)
  @ApiOperation({ summary: REGISTER_TITLE, description: REGISTER_DESCRIPTION })
  @ResponseMessage('Account created successfully')
  register(@Body() request: OnboardingDTO) {
    return this.onboardingService.createUserProfile(request);
  }
}
