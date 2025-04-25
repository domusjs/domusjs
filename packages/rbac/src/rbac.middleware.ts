import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import { RBACService } from './rbac.interface';
import { AuthContext } from './rbac.types';

export function requireRole(role: string): RequestHandler {
  return (req, res, next) => {
    const rbac = container.resolve<RBACService>('RBACService');
    const user = (req as any).auth as AuthContext;

    if (!user || !rbac.hasRole(user, role)) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    next();
  };
}

export function requireAnyRole(roles: string[]): RequestHandler {
  return (req, res, next) => {
    const rbac = container.resolve<RBACService>('RBACService');
    const user = (req as any).auth as AuthContext;

    if (!user || !rbac.hasAnyRole(user, roles)) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    next();
  };
}
