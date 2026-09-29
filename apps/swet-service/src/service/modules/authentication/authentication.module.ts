import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { SecurityConfig } from '@swet/common/config/security.config';
import { UserProfileModule } from '../profile/user-profile.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { GoogleTokenValidatorService } from './google/google-token-validator.service';

@Module({
  imports: [
    UserProfileModule,
    JwtModule.registerAsync({
      useFactory: (securityConfig: SecurityConfig): JwtModuleOptions => ({
        secret: securityConfig.jwtKey,
        signOptions: {
          expiresIn: securityConfig.jwtExpiresInSeconds,
        },
      }),
      inject: [SecurityConfig],
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, GoogleTokenValidatorService],
})
export class AuthenticationModule {}
