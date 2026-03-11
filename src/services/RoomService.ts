import type { DateTimeProvider } from '../providers/DateTimeProvider';
import type { IdProvider } from '../providers/IdProvider';
import type { MessageRepository } from '../repositories/MessageRepository';
import type { RoomRepository } from '../repositories/RoomRepository';

export const roomErrors = {
  UNABLE_TO_GET_ROOM: 'UNABLE_TO_GET_ROOM',
  UNABLE_TO_CREATE_ROOM: 'UNABLE_TO_CREATE_ROOM',
  UNABLE_TO_UPDATE_ROOM: 'UNABLE_TO_UPDATE_ROOM',
  UNABLE_TO_DELETE_ROOM: 'UNABLE_TO_DELETE_ROOM',
  UNABLE_TO_DELETE_ROOM_MESSAGES: 'UNABLE_TO_DELETE_ROOM_MESSAGES',
};

export class RoomService {
  private readonly idProvider: IdProvider;
  private readonly dateTimeProvider: DateTimeProvider;
  private readonly roomRepository: RoomRepository;
  private readonly messageRepository: MessageRepository;

  constructor(idProvider: IdProvider, dateTimeProvider: DateTimeProvider, roomRepository: RoomRepository, messageRepository: MessageRepository) {
    this.idProvider = idProvider;
    this.dateTimeProvider = dateTimeProvider;
    this.roomRepository = roomRepository;
    this.messageRepository = messageRepository;
  }

  public async getRoomById(id: string) {
    try {
      return await this.roomRepository.getRoomById(id);
    } catch {
      throw new Error(roomErrors.UNABLE_TO_GET_ROOM);
    }
  }

  public async createRoom({ name }: {
    name: string;
  }) {
    const id = this.idProvider.generateId();
    const createdAt = this.dateTimeProvider.now;
    const updatedAt = createdAt;

    try {
      return await this.roomRepository.createRoom({
        id,
        name,
        createdAt,
        updatedAt,
      });
    } catch {
      throw new Error(roomErrors.UNABLE_TO_CREATE_ROOM);
    }
  }

  public async updateRoom(id: string, { name }: {
    name: string;
  }) {
    const room = await this.roomRepository.getRoomById(id);

    if (!room) {
      throw new Error(roomErrors.UNABLE_TO_GET_ROOM);
    }

    const updatedAt = this.dateTimeProvider.now;

    try {
      return await this.roomRepository.updateRoom({
        id,
        name,
        createdAt: room.createdAt,
        updatedAt,
      });
    } catch {
      throw new Error(roomErrors.UNABLE_TO_UPDATE_ROOM);
    }
  }

  public async deleteRoom(id: string) {
    try {
      await this.messageRepository.deleteMessagesByRoomId(id);
    } catch {
      throw new Error(roomErrors.UNABLE_TO_DELETE_ROOM_MESSAGES);
    }

    try {
      return await this.roomRepository.deleteRoom(id);
    } catch {
      throw new Error(roomErrors.UNABLE_TO_DELETE_ROOM);
    }
  }
}
