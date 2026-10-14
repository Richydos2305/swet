import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class VerifyNinRequest {
  @ApiProperty({ description: 'National Identification Number, 11 digits' })
  @IsString()
  @Length(11, 11)
  nin: string;
}

export class VerifyNinResponse {
  @ApiProperty()
  nin: string;

  @ApiProperty({ required: false })
  firstName?: string;

  @ApiProperty({ required: false })
  lastName?: string;

  @ApiProperty({ required: false })
  dateOfBirth?: string;

  @ApiProperty({
    description: 'True when the NIN lookup returned a matching holder',
  })
  isVerified: boolean;
}
