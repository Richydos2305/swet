import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SecurityConfig } from '@swet/common/config/security.config';
import { AuthenticationProvider } from 'apps/swet-service/src/data/modules/profile/user-profile.enum';
import { UserProfileRepository } from 'apps/swet-service/src/data/modules/profile/user-profile.repository';
import { GoogleAuthDTO } from './dto/google-auth.dto';
import { GoogleTokenValidatorService } from './google/google-token-validator.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly securityConfig: SecurityConfig,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly googleTokenValidator: GoogleTokenValidatorService,
  ) {}

  async authenticateWithGoogle(request: GoogleAuthDTO) {
    const googleIdentity = await this.googleTokenValidator.validateToken(
      request.idToken,
    );

    let userProfile = await this.userProfileRepository.findOneByProviderId(
      googleIdentity.googleId,
    );

    if (!userProfile) {
      const emailExists = await this.userProfileRepository.findOneByEmail(
        googleIdentity.email,
      );

      if (emailExists) {
        await this.userProfileRepository.update(emailExists.id, {
          providerId: googleIdentity.googleId,
        });
      } else {
        await this.userProfileRepository.save({
          email: googleIdentity.email,
          firstName: googleIdentity.firstName,
          lastName: googleIdentity.lastName,
          authenticationProvider: AuthenticationProvider.GOOGLE,
          providerId: googleIdentity.googleId,
        });
      }
    }

    if (!userProfile) {
      throw new BadRequestException('Unable to authenticate with Google');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: userProfile.userProfilePublicId,
      email: userProfile.email,
    });

    return { accessToken, expiresIn: this.securityConfig.jwtExpiresInSeconds };
  }
}
