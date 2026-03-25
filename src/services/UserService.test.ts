import { userErrors, UserService } from './UserService';
import { afterEach, describe, expect, it, vi } from 'vitest';

const idProvider = {
  generateId: vi.fn(),
};
const passwordProvider = {
  hashPassword: vi.fn(),
  compare: vi.fn(),
};
const dateTimeProvider = {
  now: -1,
};
const userRepository = {
  getUsers: vi.fn(),
  getUserById: vi.fn(),
  getUserByUsername: vi.fn(),
  getUserByEmailAddress: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
};
const userService = new UserService(idProvider, passwordProvider, dateTimeProvider, userRepository);
const testUser = {
  id: '',
  username: '',
  displayName: '',
  emailAddress: '',
  passwordHash: '',
  createdAt: -1,
  updatedAt: -1,
};

describe('UserService', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should get users', async () => {
    vi.mocked(userRepository.getUsers).mockResolvedValueOnce([testUser]);

    const users = await userService.getUsers();

    expect(users[0]).toEqual(testUser);
  });

  it('should get user by ID', async () => {
    vi.mocked(userRepository.getUserById).mockResolvedValueOnce(testUser);

    const user = await userService.getUserById(testUser.id);

    expect(user).toEqual(testUser);
  });

  it('should get user by username', async () => {
    vi.mocked(userRepository.getUserByUsername).mockResolvedValueOnce(testUser);

    const user = await userService.getUserByUsername(testUser.username);

    expect(user).toEqual(testUser);
  });

  it('should get user by email address', async () => {
    vi.mocked(userRepository.getUserByEmailAddress).mockResolvedValueOnce(testUser);

    const user = await userService.getUserByEmailAddress(testUser.emailAddress);

    expect(user).toEqual(testUser);
  });

  it('should create user', async () => {
    vi.mocked(userRepository.getUserByEmailAddress).mockResolvedValueOnce(null);
    vi.mocked(userRepository.getUserByUsername).mockResolvedValueOnce(null);
    vi.mocked(idProvider.generateId).mockReturnValueOnce(testUser.id);
    vi.mocked(passwordProvider.hashPassword).mockResolvedValueOnce(testUser.passwordHash);
    vi.mocked(userRepository.createUser).mockImplementationOnce((user) => user);

    const user = await userService.createUser({
      username: testUser.username,
      displayName: testUser.displayName,
      emailAddress: testUser.emailAddress,
      password: testUser.passwordHash,
    });

    expect(user).toEqual(testUser);
  });

  it('should throw error if user with email address already exists', () => {
    vi.mocked(userRepository.getUserByEmailAddress).mockResolvedValueOnce(testUser);

    expect(() => userService.createUser({
      username: testUser.username,
      displayName: testUser.displayName,
      emailAddress: testUser.emailAddress,
      password: testUser.passwordHash,
    })).rejects.toThrowError(userErrors.LIMIT_ONE_USER_PER_EMAIL);
  });

  it('should throw error if user with username already exists', () => {
    vi.mocked(userRepository.getUserByEmailAddress).mockResolvedValueOnce(null);
    vi.mocked(userRepository.getUserByUsername).mockResolvedValueOnce(testUser);

    expect(() => userService.createUser({
      username: testUser.username,
      displayName: testUser.displayName,
      emailAddress: testUser.emailAddress,
      password: testUser.passwordHash,
    })).rejects.toThrowError(userErrors.USERNAME_NOT_AVAILABLE);
  });

  it('should throw error if unable to create user', () => {
    vi.mocked(userRepository.getUserByEmailAddress).mockResolvedValueOnce(null);
    vi.mocked(userRepository.getUserByUsername).mockResolvedValueOnce(null);
    vi.mocked(idProvider.generateId).mockReturnValueOnce(testUser.id);
    vi.mocked(passwordProvider.hashPassword).mockResolvedValueOnce(testUser.passwordHash);
    vi.mocked(userRepository.createUser).mockRejectedValueOnce(new Error());

    expect(() => userService.createUser({
      username: testUser.username,
      displayName: testUser.displayName,
      emailAddress: testUser.emailAddress,
      password: testUser.passwordHash,
    })).rejects.toThrowError(userErrors.UNABLE_TO_CREATE_USER);
  });

  it('should update user', async () => {
    vi.mocked(userRepository.getUserById).mockResolvedValueOnce(testUser);
    vi.mocked(userRepository.updateUser).mockImplementation((user) => user);

    const user = await userService.updateUser(testUser.id, {
      displayName: testUser.displayName,
    });

    expect(user).toEqual(testUser);
  });

  it('should throw error if user being updated cannot be found', () => {
    vi.mocked(userRepository.getUserById).mockResolvedValueOnce(null);

    expect(() => userService.updateUser(testUser.id, {
      displayName: testUser.displayName,
    })).rejects.toThrowError(userErrors.UNABLE_TO_GET_USER);
  });

  it('should throw error if unable to update user', () => {
    vi.mocked(userRepository.getUserById).mockResolvedValueOnce(testUser);
    vi.mocked(userRepository.updateUser).mockRejectedValueOnce(new Error());

    expect(() => userService.updateUser(testUser.id, {
      displayName: testUser.displayName,
    })).rejects.toThrowError(userErrors.UNABLE_TO_UPDATE_USER);
  });
});
