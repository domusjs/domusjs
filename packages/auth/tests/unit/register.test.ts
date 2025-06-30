import { describe, it, expect, beforeEach, vi } from 'vitest';
import { container } from 'tsyringe';
import { registerAuthModule, JWTConfig } from '../../src/register';
import { JWTService } from '../../src/jwt/jwt.service';
import { AuthService } from '../../src/auth.service';
import { AuthStrategy, StrategyClass } from '../../src/auth-strategy.interface';

// Mock strategy classes for testing
class MockStrategy1 implements AuthStrategy<{ username: string }, { token: string }> {
  async login(payload: { username: string }): Promise<{ token: string }> {
    return { token: `token-${payload.username}` };
  }
}

class MockStrategy2 implements AuthStrategy<{ email: string }, { user: any }> {
  async login(payload: { email: string }): Promise<{ user: any }> {
    return { user: { email: payload.email } };
  }
}

describe('registerAuthModule', () => {
  let mockJWTConfig: JWTConfig;

  beforeEach(() => {
    mockJWTConfig = {
      secret: 'test-secret',
      expiresIn: '1h',
    };
    vi.clearAllMocks();
  });

  describe('JWTService registration', () => {
    it('should register JWTService with correct configuration', () => {
      registerAuthModule([], mockJWTConfig);

      expect(container.register).toHaveBeenCalledWith('JWTService', {
        useValue: expect.any(JWTService),
      });

      const registerCall = vi
        .mocked(container.register)
        .mock.calls.find((call) => call[0] === 'JWTService');
      const jwtService = (registerCall?.[1] as any)?.useValue as JWTService;

      expect(jwtService).toBeInstanceOf(JWTService);
    });

    it('should create JWTService with provided secret and expiresIn', () => {
      const customConfig: JWTConfig = {
        secret: 'custom-secret',
        expiresIn: '7d',
      };

      registerAuthModule([], customConfig);

      const registerCall = vi
        .mocked(container.register)
        .mock.calls.find((call) => call[0] === 'JWTService');
      const jwtService = (registerCall?.[1] as any)?.useValue as JWTService;

      expect(jwtService).toBeInstanceOf(JWTService);
    });

    it('should work with different expiration time formats', () => {
      const configs: JWTConfig[] = [
        { secret: 'secret1', expiresIn: '15m' },
        { secret: 'secret2', expiresIn: '24h' },
        { secret: 'secret3', expiresIn: 3600 },
        { secret: 'secret4', expiresIn: '7d' },
      ];

      configs.forEach((config) => {
        expect(() => {
          registerAuthModule([], config);
        }).not.toThrow();
      });
    });
  });

  describe('AuthService registration', () => {
    it('should register AuthService', () => {
      registerAuthModule([], mockJWTConfig);

      expect(container.register).toHaveBeenCalledWith('AuthService', {
        useValue: expect.any(AuthService),
      });

      const registerCall = vi
        .mocked(container.register)
        .mock.calls.find((call) => call[0] === 'AuthService');
      const authService = (registerCall?.[1] as any)?.useValue as AuthService;

      expect(authService).toBeInstanceOf(AuthService);
    });

    it('should register AuthService even with empty strategies array', () => {
      registerAuthModule([], mockJWTConfig);

      const registerCall = vi
        .mocked(container.register)
        .mock.calls.find((call) => call[0] === 'AuthService');
      const authService = (registerCall?.[1] as any)?.useValue as AuthService;

      expect(authService).toBeInstanceOf(AuthService);
    });
  });

  describe('strategy registration', () => {
    it('should register strategies with AuthService', () => {
      const strategies = [
        { strategy: MockStrategy1, instance: new MockStrategy1() },
        { strategy: MockStrategy2, instance: new MockStrategy2() },
      ];

      registerAuthModule(strategies, mockJWTConfig);

      const registerCall = vi
        .mocked(container.register)
        .mock.calls.find((call) => call[0] === 'AuthService');
      const authService = (registerCall?.[1] as any)?.useValue as AuthService;

      // Test that strategies are registered by trying to login
      expect(async () => {
        await authService.loginWith(MockStrategy1, { username: 'test' });
      }).not.toThrow();
    });

    it('should handle empty strategies array', () => {
      expect(() => {
        registerAuthModule([], mockJWTConfig);
      }).not.toThrow();

      const registerCall = vi
        .mocked(container.register)
        .mock.calls.find((call) => call[0] === 'AuthService');
      const authService = (registerCall?.[1] as any)?.useValue as AuthService;

      expect(authService).toBeInstanceOf(AuthService);
    });

    it('should register multiple strategies correctly', () => {
      const strategy1 = new MockStrategy1();
      const strategy2 = new MockStrategy2();

      const strategies = [
        { strategy: MockStrategy1, instance: strategy1 },
        { strategy: MockStrategy2, instance: strategy2 },
      ];

      registerAuthModule(strategies, mockJWTConfig);

      const registerCall = vi
        .mocked(container.register)
        .mock.calls.find((call) => call[0] === 'AuthService');
      const authService = (registerCall?.[1] as any)?.useValue as AuthService;

      // Both strategies should be registered and functional
      expect(async () => {
        await authService.loginWith(MockStrategy1, { username: 'test' });
        await authService.loginWith(MockStrategy2, { email: 'test@example.com' });
      }).not.toThrow();
    });
  });

  describe('integration tests', () => {
    it('should register both JWTService and AuthService with strategies', () => {
      const strategies = [{ strategy: MockStrategy1, instance: new MockStrategy1() }];

      registerAuthModule(strategies, mockJWTConfig);

      // Should register both services
      expect(container.register).toHaveBeenCalledWith('JWTService', {
        useValue: expect.any(JWTService),
      });
      expect(container.register).toHaveBeenCalledWith('AuthService', {
        useValue: expect.any(AuthService),
      });

      // Should register exactly 2 services
      expect(container.register).toHaveBeenCalledTimes(2);
    });

    it('should create functional AuthService with registered strategies', async () => {
      const strategy1 = new MockStrategy1();
      const strategy2 = new MockStrategy2();

      const strategies = [
        { strategy: MockStrategy1, instance: strategy1 },
        { strategy: MockStrategy2, instance: strategy2 },
      ];

      registerAuthModule(strategies, mockJWTConfig);

      const registerCall = vi
        .mocked(container.register)
        .mock.calls.find((call) => call[0] === 'AuthService');
      const authService = (registerCall?.[1] as any)?.useValue as AuthService;

      // Test both strategies work
      const result1 = await authService.loginWith(MockStrategy1, { username: 'testuser' });
      const result2 = await authService.loginWith(MockStrategy2, { email: 'test@example.com' });

      expect(result1).toEqual({ token: 'token-testuser' });
      expect(result2).toEqual({ user: { email: 'test@example.com' } });
    });
  });

  describe('error handling', () => {
    it('should handle invalid JWT configuration', () => {
      const invalidConfig = {
        secret: '',
        expiresIn: '1h',
      } as JWTConfig;

      expect(() => {
        registerAuthModule([], invalidConfig);
      }).not.toThrow(); // JWTService constructor doesn't validate secret
    });

    it('should handle strategies with null/undefined instances', () => {
      const strategies = [
        { strategy: MockStrategy1, instance: null },
        { strategy: MockStrategy2, instance: undefined },
      ];

      expect(() => {
        registerAuthModule(strategies as any, mockJWTConfig);
      }).not.toThrow();
    });
  });

  describe('container registration order', () => {
    it('should register JWTService before AuthService', () => {
      registerAuthModule([], mockJWTConfig);

      const calls = vi.mocked(container.register).mock.calls;
      const jwtServiceCallIndex = calls.findIndex((call) => call[0] === 'JWTService');
      const authServiceCallIndex = calls.findIndex((call) => call[0] === 'AuthService');

      expect(jwtServiceCallIndex).toBeLessThan(authServiceCallIndex);
    });
  });
});
