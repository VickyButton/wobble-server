import type { AuthenticateUserOptions } from '../../services/AuthService';
import type { AuthValidator } from '../AuthValidator';
import z from 'zod';

const AuthenticateUserOptionsSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export class AuthValidatorZod implements AuthValidator {
  public validateAuthenticateUserOptions(options: unknown): options is AuthenticateUserOptions {
    return AuthenticateUserOptionsSchema.safeParse(options).success;
  }
}
