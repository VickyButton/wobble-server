import type { DateTimeProvider } from '../providers/DateTimeProvider';
import type { IdProvider } from '../providers/IdProvider';
import type { PasswordProvider } from '../providers/PasswordProvider';
import type { UserRepository } from '../repositories/UserRepository';

export const userErrors = {
  LIMIT_ONE_USER_PER_EMAIL: 'LIMIT_ONE_USER_PER_EMAIL',
  USERNAME_NOT_AVAILABLE: 'USERNAME_NOT_AVAILABLE',
  UNABLE_TO_GET_USER: 'UNABLE_TO_GET_USER',
  UNABLE_TO_CREATE_USER: 'UNABLE_TO_CREATE_USER',
  UNABLE_TO_UPDATE_USER: 'UNABLE_TO_UPDATE_USER',
};

export class UserService {
  private readonly idProvider: IdProvider;
  private readonly passwordProvider: PasswordProvider;
  private readonly dateTimeProvider: DateTimeProvider;
  private readonly userRepository: UserRepository;

  constructor(idProvider: IdProvider, passwordProvider: PasswordProvider, dateTimeProvider: DateTimeProvider, userRepository: UserRepository) {
    this.idProvider = idProvider;
    this.passwordProvider = passwordProvider;
    this.dateTimeProvider = dateTimeProvider;
    this.userRepository = userRepository;
  }

  public async getUsers() {
    return await this.userRepository.getUsers();
  }

  public async getUserById(id: string) {
    return await this.userRepository.getUserById(id);
  }

  public async getUserByUsername(username: string) {
    return await this.userRepository.getUserByUsername(username);
  }

  public async getUserByEmailAddress(emailAddress: string) {
    return await this.userRepository.getUserByEmailAddress(emailAddress);
  }

  public async createUser({ username, displayName, emailAddress, password }: {
    username: string;
    displayName: string;
    emailAddress: string;
    password: string;
  }) {
    const isEmailAvailable = await this.isEmailAvailable(emailAddress);

    if (!isEmailAvailable) {
      throw new Error(userErrors.LIMIT_ONE_USER_PER_EMAIL);
    }

    const isUsernameAvailable = await this.isUsernameAvailable(username);

    if (!isUsernameAvailable) {
      throw new Error(userErrors.USERNAME_NOT_AVAILABLE);
    }

    const id = this.idProvider.generateId();
    const passwordHash = await this.passwordProvider.hashPassword(password);
    const createdAt = this.dateTimeProvider.now();
    const updatedAt = createdAt;

    try {
      return await this.userRepository.createUser({
        id,
        username,
        displayName,
        emailAddress,
        passwordHash,
        createdAt,
        updatedAt,
      });
    } catch {
      throw new Error(userErrors.UNABLE_TO_CREATE_USER);
    }
  }

  public async updateUser(id: string, { displayName }: {
    displayName: string;
  }) {
    const user = await this.userRepository.getUserById(id);

    if (!user) {
      throw new Error(userErrors.UNABLE_TO_GET_USER);
    }

    const updatedAt = this.dateTimeProvider.now();

    try {
      return await this.userRepository.createUser({
        id,
        username: user.username,
        displayName,
        emailAddress: user.emailAddress,
        passwordHash: user.passwordHash,
        createdAt: user.createdAt,
        updatedAt,
      });
    } catch {
      throw new Error(userErrors.UNABLE_TO_UPDATE_USER);
    }
  }

  private async isUsernameAvailable(username: string) {
    const user = await this.userRepository.getUserByUsername(username);

    return user === null;
  };

  private async isEmailAvailable(emailAddress: string) {
    const user = await this.userRepository.getUserByEmailAddress(emailAddress);

    return user === null;
  }
}
