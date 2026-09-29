import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CompleteEmailValidationDTO {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Code sent to the email address' })
  @IsString()
  @IsNotEmpty()
  code: string;
}
