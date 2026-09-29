import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class InitiateEmailValidationDTO {
  @ApiProperty()
  @IsEmail()
  email: string;
}
