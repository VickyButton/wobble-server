import type { CreateMessageOptions, UpdateMessageOptions } from '../services/MessageService';

export interface MessageValidator {
  validateCreateMessageOptions(options: unknown): options is CreateMessageOptions;
  validateUpdateMessageOptions(options: unknown): options is UpdateMessageOptions;
}
