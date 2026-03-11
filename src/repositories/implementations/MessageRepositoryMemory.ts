import type { Message } from '../../domain/Message';
import type { MessageRepository } from '../MessageRepository';

export class MessageRepositoryMemory implements MessageRepository {
  private readonly messages = new Map<string, Message>();

  public getMessagesByParentId(parentId: string) {
    return new Promise<Message[]>((resolve) => {
      const messages = Array.from(this.messages.values()).filter((message) => message.parentId === parentId);

      resolve(messages);
    });
  }

  public getMessagesByUserId(userId: string) {
    return new Promise<Message[]>((resolve) => {
      const messages = Array.from(this.messages.values()).filter((message) => message.userId === userId);

      resolve(messages);
    });
  }

  public getMessagesByRoomId(roomId: string) {
    return new Promise<Message[]>((resolve) => {
      const messages = Array.from(this.messages.values()).filter((message) => message.roomId === roomId);

      resolve(messages);
    });
  }

  public getMessageById(id: string) {
    return new Promise<Message | null>((resolve) => {
      resolve(this.messages.get(id) ?? null);
    });
  }

  public createMessage(message: Message) {
    return new Promise<Message>((resolve) => {
      this.messages.set(message.id, message);

      resolve(message);
    });
  }

  public updateMessage(message: Message) {
    return new Promise<Message>((resolve) => {
      this.messages.set(message.id, message);

      resolve(message);
    });
  }

  public deleteMessagesByUserId(userId: string) {
    return new Promise<boolean>((resolve) => {
      let messageDeleted = false;

      for (const message of this.messages.values()) {
        if (message.userId === userId) {
          this.messages.delete(message.id);

          messageDeleted = true;
        }
      }

      resolve(messageDeleted);
    });
  }

  public deleteMessagesByRoomId(roomId: string) {
    return new Promise<boolean>((resolve) => {
      let messageDeleted = false;

      for (const message of this.messages.values()) {
        if (message.roomId === roomId) {
          this.messages.delete(message.id);

          messageDeleted = true;
        }
      }

      resolve(messageDeleted);
    });
  }

  public deleteMessage(id: string) {
    return new Promise<boolean>((resolve) => {
      resolve(this.messages.delete(id));
    });
  }
}
