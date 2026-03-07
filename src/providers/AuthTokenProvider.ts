export interface AuthTokenProvider {
  generateToken(payload: object, secretKey: string, expiresIn: number): Promise<string>;
  validateToken(token: string, secretKey: string): Promise<boolean>;
}
