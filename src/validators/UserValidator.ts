import type { CreateUserOptions, UpdateUserOptions } from '../services/UserService';

export interface UserValidator {
  validateCreateUserOptions(options: unknown): options is CreateUserOptions;
  validateUpdateUserOptions(options: unknown): options is UpdateUserOptions;
}
