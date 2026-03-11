import type { User } from '../../domain/User';
import type { UserRepository } from '../UserRepository';

export class UserRepositoryMemory implements UserRepository {
  private readonly users = new Map<string, User>();

  public getUsers() {
    return new Promise<User[]>((resolve) => {
      resolve(Array.from(this.users.values()));
    });
  }

  public getUserById(id: string) {
    return new Promise<User | null>((resolve) => {
      resolve(this.users.get(id) ?? null);
    });
  }

  public getUserByUsername(username: string) {
    return new Promise<User | null>((resolve) => {
      for (const user of this.users.values()) {
        if (user.username === username) {
          resolve(user);
        }
      }

      resolve(null);
    });
  }

  public getUserByEmailAddress(emailAddress: string) {
    return new Promise<User | null>((resolve) => {
      for (const user of this.users.values()) {
        if (user.emailAddress === emailAddress) {
          resolve(user);
        }
      }

      resolve(null);
    });
  }

  public createUser(user: User) {
    return new Promise<User>((resolve) => {
      this.users.set(user.id, user);

      resolve(user);
    });
  }

  public updateUser(user: User) {
    return new Promise<User>((resolve) => {
      this.users.set(user.id, user);

      resolve(user);
    });
  }
}
