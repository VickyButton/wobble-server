import type { Room } from '../../domain/Room';
import type { RoomRepository } from '../RoomRepository';

export class RoomRepositoryMemory implements RoomRepository {
  private readonly rooms = new Map<string, Room>();

  public getRoomById(id: string) {
    return new Promise<Room | null>((resolve) => {
      resolve(this.rooms.get(id) ?? null);
    });
  }

  public createRoom(room: Room) {
    return new Promise<Room>((resolve) => {
      this.rooms.set(room.id, room);

      resolve(room);
    });
  }

  public updateRoom(room: Room) {
    return new Promise<Room>((resolve) => {
      this.rooms.set(room.id, room);

      resolve(room);
    });
  }

  public deleteRoom(id: string) {
    return new Promise<boolean>((resolve) => {
      resolve(this.rooms.delete(id));
    });
  }
}
