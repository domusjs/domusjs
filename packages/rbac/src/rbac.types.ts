export type Role = string;

export interface AuthContext {
  userId: string;
  roles: Role[];
}
