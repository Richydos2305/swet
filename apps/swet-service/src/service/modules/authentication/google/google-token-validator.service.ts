import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { SecurityConfig } from '@swet/common/config/security.config';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { GoogleIdentity } from '../dto/google-auth.dto';

@Injectable()
export class GoogleTokenValidatorService {
  private readonly logger = new Logger(GoogleTokenValidatorService.name);
  private readonly client: OAuth2Client;

  constructor(private readonly securityConfig: SecurityConfig) {
    this.client = new OAuth2Client(this.securityConfig.googleClientId);
  }

  async validateToken(idToken: string): Promise<GoogleIdentity> {
    let payload: TokenPayload | undefined;

    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: this.securityConfig.googleClientId,
      });
      payload = ticket.getPayload();
    } catch (error) {
      this.logger.error('Google ID token verification failed', error);
      throw new UnauthorizedException('Invalid Google token');
    }

    if (!payload) {
      throw new UnauthorizedException('Invalid Google token payload');
    }

    if (!SecurityConfig.GOOGLE_ACCEPTED_ISSUERS.includes(payload.iss)) {
      throw new UnauthorizedException('Invalid Google token: wrong issuer');
    }

    if (payload.aud !== this.securityConfig.googleClientId) {
      throw new UnauthorizedException('Invalid Google token: wrong audience');
    }

    if (!payload.email_verified || !payload.email) {
      throw new BadRequestException('Google email not provided or verified');
    }

    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) {
      throw new UnauthorizedException('Google token expired');
    }

    return {
      googleId: payload.sub,
      email: payload.email,
      firstName: payload.given_name ?? '', // FIXME: user should provide a name
      lastName: payload.family_name ?? '',
      picture: payload.picture,
    };
  }
}
