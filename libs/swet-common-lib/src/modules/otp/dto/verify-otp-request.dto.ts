import { OtpPurpose } from '../otp-purpose.enum';

export class VerifyOtpRequest {
  purpose: OtpPurpose;
  requestedBy: string;
  code: string;
  ttlSeconds?: number;
}
