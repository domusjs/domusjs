import { container } from 'tsyringe';

import { AuthService } from './auth.service';
import { JWTService } from './jwt/jwt.service';
import { AuthProviderEntry } from './';

// No providers by default. We let devs register their own.
const defaultProviders: AuthProviderEntry[] = [];

export function registerAuthModule(providers: AuthProviderEntry[] = defaultProviders) {
  container.register<JWTService>('JWTService', { useClass: JWTService });

  container.register<AuthProviderEntry[]>('AuthProviders', {
    useValue: providers,
  });

  container.register<AuthService>('AuthService', { useClass: AuthService });
}
