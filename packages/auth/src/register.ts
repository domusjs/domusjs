import { container } from 'tsyringe';
import jwt from 'jsonwebtoken';

import { JWTService } from './jwt/jwt.service';
import { AuthStrategy } from './auth-strategy.interface';
import { AuthService } from './auth.service';
import { StrategyClass } from './auth-strategy.interface';

interface AuthStrategyEntry<TPayload = any, TResult = any> {
  strategy: StrategyClass<TPayload, TResult>;
  instance: AuthStrategy<TPayload, TResult>;
}

export interface JWTConfig {
  secret: string;
  expiresIn: jwt.SignOptions['expiresIn'];
}

export function registerAuthModule(strategies: AuthStrategyEntry[] = [], JWTConfig: JWTConfig) {
  const jwtService = new JWTService(JWTConfig.secret, JWTConfig.expiresIn);

  container.register<JWTService>('JWTService', { useValue: jwtService });

  const authService = new AuthService();

  for (const { strategy, instance } of strategies) {
    authService.register(strategy, instance);
  }

  container.register<AuthService>('AuthService', {
    useValue: authService,
  });
}
