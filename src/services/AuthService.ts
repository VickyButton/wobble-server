import type { AuthTokenProvider } from '../providers/AuthTokenProvider';
import type { PasswordProvider } from '../providers/PasswordProvider';
import type { UserRepository } from '../repositories/UserRepository';
import { useConfig } from '../utils/useConfig';

export const authErrors = {
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  INCORRECT_CREDENTIALS: 'INCORRECT_CREDENTIALS',
};

const AUTH_TOKEN_EXPIRES_IN = 60 * 60 * 24 * 7; // 1 week

export class AuthService {
  private readonly authTokenProvider: AuthTokenProvider;
  private readonly passwordProvider: PasswordProvider;
  private readonly userRepository: UserRepository;

  constructor(authTokenProvider: AuthTokenProvider, passwordProvider: PasswordProvider, userRepository: UserRepository) {
    this.authTokenProvider = authTokenProvider;
    this.passwordProvider = passwordProvider;
    this.userRepository = userRepository;
  }

  public async authenticateUser({ username, password }: {
    username: string;
    password: string;
  }) {
    const user = await this.userRepository.getUserByUsername(username);

    if (!user) {
      throw new Error(authErrors.USER_NOT_FOUND);
    }

    const isAuthenticated = await this.passwordProvider.compare(password, user.passwordHash);

    if (!isAuthenticated) {
      throw new Error(authErrors.INCORRECT_CREDENTIALS);
    }

    const { secretKey } = useConfig();
    const payload = {
      userId: user.id,
    };

    return await this.authTokenProvider.generateToken(payload, secretKey, AUTH_TOKEN_EXPIRES_IN);
  }

  public async validateToken(token: string) {
    const { secretKey } = useConfig();

    return await this.authTokenProvider.validateToken(token, secretKey);
  }
}
