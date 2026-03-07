import type { Room } from '../domain/Room';

export interface RoomRepository {
  getRoomById(id: string): Promise<Room | null>;
  createRoom(room: Room): Promise<Room>;
  updateRoom(room: Room): Promise<Room>;
  deleteRoom(id: string): Promise<boolean>;
}
