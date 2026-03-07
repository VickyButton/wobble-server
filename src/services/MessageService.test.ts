import { messageErrors, MessageService } from './MessageService';
import { afterEach, describe, expect, it, vi } from 'vitest';

const idProvider = {
  generateId: vi.fn(),
};
const dateTimeProvider = {
  now: vi.fn(),
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
const messageService = new MessageService(idProvider, dateTimeProvider, messageRepository);
const testMessage = {
  parentId: '',
  userId: '',
  roomId: '',
  id: '',
  body: '',
  createdAt: -1,
  updatedAt: -1,
};

describe('MessageService', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should get messages by parent ID', async () => {
    vi.mocked(messageRepository.getMessagesByParentId).mockResolvedValueOnce([testMessage]);

    const messages = await messageService.getMessagesByParentId(testMessage.parentId);

    expect(messages[0]).toEqual(testMessage);
  });

  it('should throw an error if unable to get messages by parent ID', () => {
    vi.mocked(messageRepository.getMessagesByParentId).mockRejectedValueOnce(new Error());

    expect(() => messageService.getMessagesByParentId(testMessage.parentId)).rejects.toThrowError(messageErrors.UNABLE_TO_GET_MESSAGE);
  });

  it('should get messages by user ID', async () => {
    vi.mocked(messageRepository.getMessagesByUserId).mockResolvedValueOnce([testMessage]);

    const messages = await messageService.getMessagesByUserId(testMessage.userId);

    expect(messages[0]).toEqual(testMessage);
  });

  it('should throw an error if unable to get messages by user ID', () => {
    vi.mocked(messageRepository.getMessagesByUserId).mockRejectedValueOnce(new Error());

    expect(() => messageService.getMessagesByUserId(testMessage.userId)).rejects.toThrowError(messageErrors.UNABLE_TO_GET_MESSAGE);
  });

  it('should get messages by room ID', async () => {
    vi.mocked(messageRepository.getMessagesByRoomId).mockResolvedValueOnce([testMessage]);

    const messages = await messageService.getMessagesByRoomId(testMessage.roomId);

    expect(messages[0]).toEqual(testMessage);
  });

  it('should throw an error if unable to get messages by room ID', () => {
    vi.mocked(messageRepository.getMessagesByRoomId).mockRejectedValueOnce(new Error());

    expect(() => messageService.getMessagesByRoomId(testMessage.roomId)).rejects.toThrowError(messageErrors.UNABLE_TO_GET_MESSAGE);
  });

  it('should get message by ID', async () => {
    vi.mocked(messageRepository.getMessageById).mockResolvedValueOnce(testMessage);

    const message = await messageService.getMessageById(testMessage.id);

    expect(message).toEqual(testMessage);
  });

  it('should throw an error if unable to get message by ID', () => {
    vi.mocked(messageRepository.getMessageById).mockRejectedValueOnce(new Error());

    expect(() => messageService.getMessageById(testMessage.id)).rejects.toThrowError(messageErrors.UNABLE_TO_GET_MESSAGE);
  });

  it('should create message', async () => {
    vi.mocked(idProvider.generateId).mockReturnValueOnce(testMessage.id);
    vi.mocked(dateTimeProvider.now).mockReturnValueOnce(testMessage.createdAt);
    vi.mocked(messageRepository.createMessage).mockImplementationOnce((message) => message);

    const message = await messageService.createMessage({
      parentId: testMessage.parentId,
      userId: testMessage.userId,
      roomId: testMessage.roomId,
      body: testMessage.body,
    });

    expect(message).toEqual(testMessage);
  });

  it('should throw error if unable to create message', () => {
    vi.mocked(idProvider.generateId).mockReturnValueOnce(testMessage.id);
    vi.mocked(dateTimeProvider.now).mockReturnValueOnce(testMessage.createdAt);
    vi.mocked(messageRepository.createMessage).mockRejectedValueOnce(new Error());

    expect(() => messageService.createMessage({
      parentId: testMessage.parentId,
      userId: testMessage.userId,
      roomId: testMessage.roomId,
      body: testMessage.body,
    })).rejects.toThrowError(messageErrors.UNABLE_TO_CREATE_MESSAGE);
  });

  it('should update message', async () => {
    vi.mocked(messageRepository.getMessageById).mockResolvedValueOnce(testMessage);
    vi.mocked(dateTimeProvider.now).mockReturnValueOnce(testMessage.createdAt);
    vi.mocked(messageRepository.updateMessage).mockImplementation((message) => message);

    const message = await messageService.updateMessage(testMessage.id, {
      body: testMessage.body,
    });

    expect(message).toEqual(testMessage);
  });

  it('should throw error if message being updated cannot be found', async () => {
    vi.mocked(messageRepository.getMessageById).mockResolvedValueOnce(null);

    expect(() => messageService.updateMessage(testMessage.id, {
      body: testMessage.body,
    })).rejects.toThrowError(messageErrors.UNABLE_TO_GET_MESSAGE);
  });

  it('should throw error if unable to update message', async () => {
    vi.mocked(messageRepository.getMessageById).mockResolvedValueOnce(testMessage);
    vi.mocked(dateTimeProvider.now).mockReturnValueOnce(testMessage.createdAt);
    vi.mocked(messageRepository.updateMessage).mockRejectedValueOnce(new Error());

    expect(() => messageService.updateMessage(testMessage.id, {
      body: testMessage.body,
    })).rejects.toThrowError(messageErrors.UNABLE_TO_UPDATE_MESSAGE);
  });

  it('should delete messages by user ID', async () => {
    vi.mocked(messageRepository.deleteMessagesByUserId).mockResolvedValueOnce(true);

    const isDeleted = await messageService.deleteMessagesByUserId(testMessage.userId);

    expect(isDeleted).toBe(true);
  });

  it('should throw error if unable to delete messages by user ID', async () => {
    vi.mocked(messageRepository.deleteMessagesByUserId).mockRejectedValueOnce(new Error());

    expect(() => messageService.deleteMessagesByUserId(testMessage.userId)).rejects.toThrowError(messageErrors.UNABLE_TO_DELETE_MESSAGE);
  });

  it('should delete messages by room ID', async () => {
    vi.mocked(messageRepository.deleteMessagesByRoomId).mockResolvedValueOnce(true);

    const isDeleted = await messageService.deleteMessagesByRoomId(testMessage.roomId);

    expect(isDeleted).toBe(true);
  });

  it('should throw error if unable to delete messages by room ID', async () => {
    vi.mocked(messageRepository.deleteMessagesByRoomId).mockRejectedValueOnce(new Error());

    expect(() => messageService.deleteMessagesByRoomId(testMessage.roomId)).rejects.toThrowError(messageErrors.UNABLE_TO_DELETE_MESSAGE);
  });

  it('should delete message', async () => {
    vi.mocked(messageRepository.deleteMessage).mockResolvedValueOnce(true);

    const isDeleted = await messageService.deleteMessage(testMessage.id);

    expect(isDeleted).toBe(true);
  });

  it('should throw error if unable to delete message', async () => {
    vi.mocked(messageRepository.deleteMessage).mockRejectedValueOnce(new Error());

    expect(() => messageService.deleteMessage(testMessage.id)).rejects.toThrowError(messageErrors.UNABLE_TO_DELETE_MESSAGE);
  });
});
