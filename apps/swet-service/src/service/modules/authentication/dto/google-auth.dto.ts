import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleAuthDTO {
  @ApiProperty({ description: 'Google-issued ID token' })
  @IsString()
  @IsNotEmpty()
  idToken: string;
}

export class GoogleIdentity {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
}
