import type { CreateUserOptions, UpdateUserOptions } from '../../services/UserService';
import type { UserValidator } from '../UserValidator';
import z from 'zod';

const CreateUserOptionsSchema = z.object({
  username: z.string(),
  displayName: z.string(),
  emailAddress: z.email(),
  password: z.string(),
});

const UpdateUserOptionsSchema = z.object({
  displayName: z.string(),
});

export class UserValidatorZod implements UserValidator {
  public validateCreateUserOptions(options: unknown): options is CreateUserOptions {
    return CreateUserOptionsSchema.safeParse(options).success;
  }

  public validateUpdateUserOptions(options: unknown): options is UpdateUserOptions {
    return UpdateUserOptionsSchema.safeParse(options).success;
  }
}
