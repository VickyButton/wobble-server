export interface User {
  id: string;
  username: string;
  displayName: string;
  emailAddress: string;
  passwordHash: string;
  createdAt: number;
  updatedAt: number;
}
