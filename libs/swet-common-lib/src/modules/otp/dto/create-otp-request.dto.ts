import { OtpPurpose } from '../otp-purpose.enum';

export class CreateOtpRequest {
  purpose: OtpPurpose;
  requestedBy: string;
  ttlSeconds?: number;
  attempts?: number;
}
