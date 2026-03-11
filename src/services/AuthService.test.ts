import { authErrors, AuthService } from './AuthService';
import { afterEach, describe, expect, it, vi } from 'vitest';

const authTokenProvider = {
  generateToken: vi.fn(),
  validateToken: vi.fn(),
};
const passwordProvider = {
  hashPassword: vi.fn(),
  compare: vi.fn(),
};
const userRepository = {
  getUsers: vi.fn(),
  getUserById: vi.fn(),
  getUserByUsername: vi.fn(),
  getUserByEmailAddress: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
};
const authService = new AuthService(authTokenProvider, passwordProvider, userRepository);
const testUser = {
  id: '',
  username: '',
  passwordHash: '',
};

vi.mock('../utils/useConfig', () => ({
  useConfig: () => ({
    secretKey: '',
  }),
}));

describe('AuthService', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should authenticate user', async () => {
    const mockToken = 'token';

    vi.mocked(userRepository.getUserByUsername).mockResolvedValueOnce(testUser);
    vi.mocked(passwordProvider.compare).mockResolvedValueOnce(true);
    vi.mocked(authTokenProvider.generateToken).mockResolvedValueOnce(mockToken);

    const token = await authService.authenticateUser({
      username: testUser.username,
      password: testUser.passwordHash,
    });

    expect(token).toBe(mockToken);
  });

  it('should throw error if user being authenticated cannot be found', () => {
    vi.mocked(userRepository.getUserByUsername).mockResolvedValueOnce(null);

    expect(() => authService.authenticateUser({
      username: testUser.username,
      password: testUser.passwordHash,
    })).rejects.toThrowError(authErrors.USER_NOT_FOUND);
  });

  it('should throw error if incorrect password is used', () => {
    vi.mocked(userRepository.getUserByUsername).mockResolvedValueOnce(testUser);
    vi.mocked(passwordProvider.compare).mockResolvedValueOnce(false);

    expect(() => authService.authenticateUser({
      username: testUser.username,
      password: testUser.passwordHash,
    })).rejects.toThrowError(authErrors.INCORRECT_CREDENTIALS);
  });

  it('should validate token', async () => {
    vi.mocked(authTokenProvider.validateToken).mockResolvedValueOnce(true);

    const result = await authService.validateToken('');

    expect(result).toBe(true);
  });
});
