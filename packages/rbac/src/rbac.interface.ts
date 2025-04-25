
import { AuthContext, Role } from './rbac.types';

export interface RBACService {
  hasRole(user: AuthContext, role: Role): boolean;
  hasAnyRole(user: AuthContext, roles: Role[]): boolean;
}
