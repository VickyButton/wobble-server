import type { AuthTokenProvider } from '../AuthTokenProvider';
import { sign, verify } from 'jsonwebtoken';

export class AuthTokenProviderJwt implements AuthTokenProvider {
  public async generateToken(payload: object, secretKey: string, expiresIn: number) {
    return sign(payload, secretKey, {
      algorithm: 'RS256',
      expiresIn,
    });
  }

  public async validateToken(token: string, secretKey: string) {
    try {
      verify(token, secretKey);

      return true;
    } catch {
      return false;
    }
  }
}
