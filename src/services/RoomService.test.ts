import { roomErrors, RoomService } from './RoomService';
import { afterEach, describe, expect, it, vi } from 'vitest';

const idProvider = {
  generateId: vi.fn(),
};
const dateTimeProvider = {
  now: vi.fn(),
};
const roomRepository = {
  getRoomById: vi.fn(),
  createRoom: vi.fn(),
  updateRoom: vi.fn(),
  deleteRoom: vi.fn(),
};
const messageRepository = {
  getMessagesByParentId: vi.fn(),
  getMessagesByUserId: vi.fn(),
  getMessagesByRoomId: vi.fn(),
  getMessageById: vi.fn(),
  createMessage: vi.fn(),
  updateMessage: vi.fn(),
  deleteMessagesByUserId: vi.fn(),
  deleteMessagesByRoomId: vi.fn(),
  deleteMessage: vi.fn(),
};
const roomService = new RoomService(idProvider, dateTimeProvider, roomRepository, messageRepository);
const testRoom = {
  id: '',
  name: '',
  createdAt: -1,
  updatedAt: -1,
};

describe('RoomService', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should get room by ID', async () => {
    vi.mocked(roomRepository.getRoomById).mockResolvedValueOnce(testRoom);

    const room = await roomService.getRoomById('');

    expect(room).toEqual(testRoom);
  });

  it('should throw error if unable to get room by ID', () => {
    vi.mocked(roomRepository.getRoomById).mockRejectedValueOnce(new Error());

    expect(() => roomService.getRoomById('')).rejects.toThrowError(roomErrors.UNABLE_TO_GET_ROOM);
  });

  it('should create room', async () => {
    vi.mocked(idProvider.generateId).mockReturnValueOnce(testRoom.id);
    vi.mocked(dateTimeProvider.now).mockReturnValueOnce(testRoom.createdAt);
    vi.mocked(roomRepository.createRoom).mockImplementation((room) => room);

    const room = await roomService.createRoom({
      name: testRoom.name,
    });

    expect(room).toEqual(testRoom);
  });

  it('should throw error if unable to create room', () => {
    vi.mocked(idProvider.generateId).mockReturnValueOnce(testRoom.id);
    vi.mocked(dateTimeProvider.now).mockReturnValueOnce(testRoom.createdAt);
    vi.mocked(roomRepository.createRoom).mockRejectedValueOnce(new Error());

    expect(() => roomService.createRoom({
      name: testRoom.name,
    })).rejects.toThrowError(roomErrors.UNABLE_TO_CREATE_ROOM);
  });

  it('should update room', async () => {
    vi.mocked(roomRepository.getRoomById).mockResolvedValueOnce(testRoom);
    vi.mocked(dateTimeProvider.now).mockReturnValueOnce(testRoom.createdAt);
    vi.mocked(roomRepository.updateRoom).mockImplementation((room) => room);

    const room = await roomService.updateRoom(testRoom.id, {
      name: testRoom.name,
    });

    expect(room).toEqual(testRoom);
  });

  it('should throw error if room being updated cannot be found', () => {
    vi.mocked(roomRepository.getRoomById).mockResolvedValueOnce(null);

    expect(() => roomService.updateRoom(testRoom.id, {
      name: testRoom.name,
    })).rejects.toThrowError(roomErrors.UNABLE_TO_GET_ROOM);
  });

  it('should throw error if unable to update room', () => {
    vi.mocked(roomRepository.getRoomById).mockResolvedValueOnce(testRoom);
    vi.mocked(dateTimeProvider.now).mockReturnValueOnce(testRoom.createdAt);
    vi.mocked(roomRepository.updateRoom).mockRejectedValueOnce(new Error());

    expect(() => roomService.updateRoom(testRoom.id, {
      name: testRoom.name,
    })).rejects.toThrowError(roomErrors.UNABLE_TO_UPDATE_ROOM);
  });

  it('should delete room', async () => {
    vi.mocked(messageRepository.deleteMessagesByRoomId).mockResolvedValueOnce();
    vi.mocked(roomRepository.deleteRoom).mockResolvedValueOnce(true);

    const isDeleted = await roomService.deleteRoom(testRoom.id);

    expect(isDeleted).toBe(true);
  });

  it('should throw error if unable to delete room messages', () => {
    vi.mocked(messageRepository.deleteMessagesByRoomId).mockRejectedValueOnce(new Error());

    expect(() => roomService.deleteRoom(testRoom.id)).rejects.toThrowError(roomErrors.UNABLE_TO_DELETE_ROOM_MESSAGES);
  });

  it('should throw error if unable to delete room', () => {
    vi.mocked(messageRepository.deleteMessagesByRoomId).mockResolvedValueOnce();
    vi.mocked(roomRepository.deleteRoom).mockRejectedValueOnce(new Error());

    expect(() => roomService.deleteRoom(testRoom.id)).rejects.toThrowError(roomErrors.UNABLE_TO_DELETE_ROOM);
  });
});
