import { RBACService } from './rbac.interface';
import { AuthContext, Role } from './rbac.types';

export class BasicRBACService implements RBACService {
  hasRole(user: AuthContext, role: Role): boolean {
    return user.roles.includes(role);
  }

  hasAnyRole(user: AuthContext, roles: Role[]): boolean {
    return roles.some((role) => user.roles.includes(role));
  }
}
