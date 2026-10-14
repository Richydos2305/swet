import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, Length } from 'class-validator';
import { MatchResult } from './match-result.enum';

export class VerifyBvnRequest {
  @ApiProperty({ description: 'Bank Verification Number, 11 digits' })
  @IsString()
  @Length(11, 11)
  bvn: string;

  @ApiProperty({ description: 'Full name to check against the BVN record' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ description: 'Date of birth, ISO 8601 (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  dateOfBirth: string;

  @ApiProperty({ description: 'Mobile number to check against the BVN record' })
  @IsString()
  @IsOptional()
  phone: string;
}

export class VerifyBvnResponse {
  @ApiProperty()
  bvn: string;

  @ApiProperty({ enum: MatchResult })
  nameMatch: MatchResult;

  @ApiProperty({ enum: MatchResult })
  dateOfBirthMatch: MatchResult;

  @ApiProperty({ enum: MatchResult })
  mobileNoMatch: MatchResult;

  @ApiProperty({ description: 'True only when every field is a full match' })
  isVerified: boolean;
}
