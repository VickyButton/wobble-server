import type { DateTimeProvider } from '../providers/DateTimeProvider';
import type { IdProvider } from '../providers/IdProvider';
import type { MessageRepository } from '../repositories/MessageRepository';

export const messageErrors = {
  UNABLE_TO_GET_MESSAGE: 'UNABLE_TO_GET_MESSAGE',
  UNABLE_TO_CREATE_MESSAGE: 'UNABLE_TO_CREATE_MESSAGE',
  UNABLE_TO_UPDATE_MESSAGE: 'UNABLE_TO_UPDATE_MESSAGE',
  UNABLE_TO_DELETE_MESSAGE: 'UNABLE_TO_DELETE_MESSAGE',
};

export interface CreateMessageOptions {
  parentId?: string;
  userId: string;
  roomId: string;
  body: string;
}

export interface UpdateMessageOptions {
  body: string;
}

export class MessageService {
  private readonly idProvider: IdProvider;
  private readonly dateTimeProvider: DateTimeProvider;
  private readonly messageRepository: MessageRepository;

  constructor(idProvider: IdProvider, dateTimeProvider: DateTimeProvider, messageRepository: MessageRepository) {
    this.idProvider = idProvider;
    this.dateTimeProvider = dateTimeProvider;
    this.messageRepository = messageRepository;
  }

  public async getMessagesByParentId(parentId: string) {
    try {
      return await this.messageRepository.getMessagesByParentId(parentId);
    } catch {
      throw new Error(messageErrors.UNABLE_TO_GET_MESSAGE);
    }
  }

  public async getMessagesByUserId(userId: string) {
    try {
      return await this.messageRepository.getMessagesByUserId(userId);
    } catch {
      throw new Error(messageErrors.UNABLE_TO_GET_MESSAGE);
    }
  }

  public async getMessagesByRoomId(roomId: string) {
    try {
      return await this.messageRepository.getMessagesByRoomId(roomId);
    } catch {
      throw new Error(messageErrors.UNABLE_TO_GET_MESSAGE);
    }
  }

  public async getMessageById(id: string) {
    try {
      return await this.messageRepository.getMessageById(id);
    } catch {
      throw new Error(messageErrors.UNABLE_TO_GET_MESSAGE);
    }
  }

  public async createMessage({ parentId, userId, roomId, body }: CreateMessageOptions) {
    const id = this.idProvider.generateId();
    const createdAt = this.dateTimeProvider.now;
    const updatedAt = createdAt;

    try {
      return await this.messageRepository.createMessage({
        parentId,
        userId,
        roomId,
        id,
        body,
        createdAt,
        updatedAt,
      });
    } catch {
      throw new Error(messageErrors.UNABLE_TO_CREATE_MESSAGE);
    }
  }

  public async updateMessage(id: string, { body }: UpdateMessageOptions) {
    const message = await this.messageRepository.getMessageById(id);

    if (!message) {
      throw new Error(messageErrors.UNABLE_TO_GET_MESSAGE);
    }

    const updatedAt = this.dateTimeProvider.now;

    try {
      return await this.messageRepository.updateMessage({
        parentId: message.parentId,
        userId: message.userId,
        roomId: message.roomId,
        id,
        body,
        createdAt: message.createdAt,
        updatedAt,
      });
    } catch {
      throw new Error(messageErrors.UNABLE_TO_UPDATE_MESSAGE);
    }
  }

  public async deleteMessagesByUserId(userId: string) {
    try {
      return await this.messageRepository.deleteMessagesByUserId(userId);
    } catch {
      throw new Error(messageErrors.UNABLE_TO_DELETE_MESSAGE);
    }
  }

  public async deleteMessagesByRoomId(roomId: string) {
    try {
      return await this.messageRepository.deleteMessagesByRoomId(roomId);
    } catch {
      throw new Error(messageErrors.UNABLE_TO_DELETE_MESSAGE);
    }
  }

  public async deleteMessage(id: string) {
    try {
      return await this.messageRepository.deleteMessage(id);
    } catch {
      throw new Error(messageErrors.UNABLE_TO_DELETE_MESSAGE);
    }
  }
}
