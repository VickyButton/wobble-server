import type { PasswordProvider } from '../PasswordProvider';
import { hash, compare } from 'bcrypt';

const SALT_ROUNDS = 10;

export class PasswordProviderBcrypt implements PasswordProvider {
  public async hashPassword(password: string) {
    return await hash(password, SALT_ROUNDS);
  }

  public async compare(password: string, hash: string) {
    return await compare(password, hash);
  }
}
