import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { SecurityConfig } from '../../config/security.config';
import { TokenUtil } from '../../utils/token.util';
import { CreateOtpRequest } from './dto/create-otp-request.dto';
import { VerifyOtpRequest } from './dto/verify-otp-request.dto';
import { OtpPurpose } from './otp-purpose.enum';
import { OtpRecord } from './otp-record';

@Injectable()
export class OtpService {
  constructor(
    private readonly securityConfig: SecurityConfig,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async keep(request: CreateOtpRequest): Promise<{ code: string }> {
    const {
      purpose,
      requestedBy,
      ttlSeconds = this.securityConfig.otpTtlSeconds,
      attempts = this.securityConfig.otpAttempts,
    } = request;

    const code = TokenUtil.generateOTP();

    await this.cache.set<OtpRecord>(
      this.buildKey(purpose, requestedBy),
      { code, attemptsLeft: attempts },
      ttlSeconds * 1000,
    );

    return { code };
  }

  async verify(request: VerifyOtpRequest): Promise<void> {
    const {
      purpose,
      requestedBy,
      code,
      ttlSeconds = this.securityConfig.otpTtlSeconds,
    } = request;

    const key = this.buildKey(purpose, requestedBy);
    const record = await this.cache.get<OtpRecord>(key);

    if (!record) throw new BadRequestException('Invalid or expired code');

    if (record.code !== code) {
      const attemptsLeft = record.attemptsLeft - 1;

      if (attemptsLeft <= 0) {
        await this.cache.del(key);
        throw new BadRequestException(
          'Invalid code, no attempts left. Request a resend',
        );
      }

      await this.cache.set(key, { ...record, attemptsLeft }, ttlSeconds * 1000);

      throw new BadRequestException(
        `Invalid code, you have ${attemptsLeft} attempt(s) left`,
      );
    }

    await this.cache.del(key);
  }

  async invalidate(purpose: OtpPurpose, requestedBy: string): Promise<void> {
    await this.cache.del(this.buildKey(purpose, requestedBy));
  }

  private buildKey(purpose: OtpPurpose, requestedBy: string): string {
    return `otp:${purpose}:${requestedBy.trim().toLowerCase()}`;
  }
}
