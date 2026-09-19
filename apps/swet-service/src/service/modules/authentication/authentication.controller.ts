import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { API_V1 } from '@swet/common/constant/api-constant';
import {
  AUTHENTICATION_API,
  AUTHENTICATION_MODULE_TITLE,
  GOOGLE_API,
  GOOGLE_AUTH_DESCRIPTION,
  GOOGLE_AUTH_TITLE,
} from '@swet/common/constant/swagger/authentication-swagger.constant';
import { AuthenticationService } from './authentication.service';
import { GoogleAuthDTO } from './dto/google-auth.dto';

@Controller(API_V1 + AUTHENTICATION_API)
@ApiTags(AUTHENTICATION_MODULE_TITLE)
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post(GOOGLE_API)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: GOOGLE_AUTH_TITLE,
    description: GOOGLE_AUTH_DESCRIPTION,
  })
  google(@Body() request: GoogleAuthDTO) {
    return this.authenticationService.authenticateWithGoogle(request);
  }
}
