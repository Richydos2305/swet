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
}
