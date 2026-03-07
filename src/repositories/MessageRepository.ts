import type { Message } from '../domain/Message';

export interface MessageRepository {
  getMessagesByParentId(parentId: string): Promise<Message[]>;
  getMessagesByUserId(userId: string): Promise<Message[]>;
  getMessagesByRoomId(roomId: string): Promise<Message[]>;
  getMessageById(id: string): Promise<Message | null>;
  createMessage(message: Message): Promise<Message>;
  updateMessage(message: Message): Promise<Message>;
  deleteMessagesByRoomId(roomId: string): Promise<boolean>;
  deleteMessage(id: string): Promise<boolean>;
}
