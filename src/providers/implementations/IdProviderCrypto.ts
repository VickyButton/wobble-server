import type { IdProvider } from '../IdProvider';
import crypto from 'crypto';

export class IdProviderHexadecimal implements IdProvider {
  public generateId() {
    return this.generateHexadecimalString(16);
  }

  private generateHexadecimalString(length = 8) {
    if (length < 0) {
      throw new Error('Invalid string length');
    }

    const byteLength = Math.ceil(length / 2);
    const randomBytes = crypto.randomBytes(byteLength);

    return randomBytes.toString('hex').slice(0, length);
  }
}
