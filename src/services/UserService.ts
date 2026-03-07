import type { DateTimeProvider } from '../providers/DateTimeProvider';
import type { IdProvider } from '../providers/IdProvider';
import type { PasswordProvider } from '../providers/PasswordProvider';
import type { UserRepository } from '../repositories/UserRepository';

export const userErrors = {
  LIMIT_ONE_USER_PER_EMAIL: 'LIMIT_ONE_USER_PER_EMAIL',
  USERNAME_NOT_AVAILABLE: 'USERNAME_NOT_AVAILABLE',
  UNABLE_TO_CREATE_USER: 'UNABLE_TO_CREATE_USER',
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
    const isEmailInUse = await this.isEmailInUse(emailAddress);

    if (!isEmailInUse) {
      throw new Error(userErrors.LIMIT_ONE_USER_PER_EMAIL);
    }

    const isUsernameTaken = await this.isUsernameTaken(username);

    if (!isUsernameTaken) {
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

  private async isUsernameTaken(username: string) {
    const user = await this.userRepository.getUserByUsername(username);

    return user !== null;
  };

  private async isEmailInUse(emailAddress: string) {
    const user = await this.userRepository.getUserByEmailAddress(emailAddress);

    return user !== null;
  }
}
