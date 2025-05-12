import { container } from 'tsyringe';
import jwt from 'jsonwebtoken';

import { AuthService } from './auth.service';
import { JWTService } from './jwt/jwt.service';
import { AuthProviderEntry } from './';

// No providers by default. We let devs register their own.
const defaultProviders: AuthProviderEntry[] = [];

export function registerAuthModule(providers: AuthProviderEntry[] = defaultProviders) {
  // 1. Register the token secret and expiry
  container.register<string>('TokenSecret', { useValue: process.env.JWT_SECRET || 'default' });
  container.register<jwt.SignOptions['expiresIn']>('TokenExpiry', { useValue: '1h' });

  container.register<JWTService>('JWTService', {
    useFactory: (c) =>
      new JWTService(
        c.resolve<string>('TokenSecret'),
        c.resolve<jwt.SignOptions['expiresIn']>('TokenExpiry')
      ),
  });

  // 2. Register the auth providers
  container.register<AuthProviderEntry[]>('AuthProviders', {
    useValue: providers,
  });

  // 3. Register the auth service
  container.register<AuthService>('AuthService', { useClass: AuthService });
}
