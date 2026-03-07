export interface PasswordProvider {
  hashPassword(password: string): Promise<string>;
}
