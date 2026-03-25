import type { CreateMessageOptions, UpdateMessageOptions } from '../../services/MessageService';
import type { MessageValidator } from '../MessageValidator';
import z from 'zod';

const CreateMessageOptionsSchema = z.object({
  parentId: z.string().optional(),
  userId: z.string(),
  roomId: z.string(),
  body: z.string(),
});

const UpdateMessageOptionsSchema = z.object({
  body: z.string(),
});

export class MessageValidatorZod implements MessageValidator {
  public validateCreateMessageOptions(options: unknown): options is CreateMessageOptions {
    return CreateMessageOptionsSchema.safeParse(options).success;
  }

  public validateUpdateMessageOptions(options: unknown): options is UpdateMessageOptions {
    return UpdateMessageOptionsSchema.safeParse(options).success;
  }
}
