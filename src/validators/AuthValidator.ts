import type { AuthenticateUserOptions } from '../services/AuthService';

export interface AuthValidator {
  validateAuthenticateUserOptions(options: unknown): options is AuthenticateUserOptions;
}
