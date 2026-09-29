import { argon2id, hash, verify } from 'argon2';
import { randomFillSync } from 'crypto';
import { customAlphabet } from 'nanoid';
import { uuidv7 } from 'uuidv7';

export class TokenUtil {
  static readonly UPPER_ALPHA_NUMERIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  static generateTimeSortableIdentifier(prefix = ''): string {
    const id = uuidv7().replace(/-/g, '').toUpperCase();
    return `${prefix}${id}`;
  }

  static generateIdentifier(prefix = ''): string {
    const id = customAlphabet(TokenUtil.UPPER_ALPHA_NUMERIC, 18)();
    return `${prefix}${id}`;
  }

  static generateOTP(length: number = 6): string {
    const digits = '0123456789';
    return Array.from(randomFillSync(new Uint8Array(length)))
      .map((byte) => digits[byte % digits.length])
      .join('');
  }

  static async createHashString(plainText: string): Promise<string> {
    return hash(plainText, {
      type: argon2id,
      memoryCost: 64 * 1024,
      timeCost: 3,
      parallelism: 1,
    });
  }

  static async compareHashString(
    plain: string,
    hash: string,
  ): Promise<boolean> {
    return verify(hash, plain);
  }
}
