import { describe, it, expect, beforeEach, vi } from 'vitest';
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

describe('AuthService', () => {
  let authService: AuthService;
  let mockStrategy1: MockStrategy1;
  let mockStrategy2: MockStrategy2;

  beforeEach(() => {
    authService = new AuthService();
    mockStrategy1 = new MockStrategy1();
    mockStrategy2 = new MockStrategy2();
  });

  describe('register', () => {
    it('should register a strategy successfully', () => {
      expect(() => {
        authService.register(MockStrategy1, mockStrategy1);
      }).not.toThrow();
    });

    it('should register multiple strategies', () => {
      expect(() => {
        authService.register(MockStrategy1, mockStrategy1);
        authService.register(MockStrategy2, mockStrategy2);
      }).not.toThrow();
    });

    it('should overwrite existing strategy when registering same class', () => {
      const newInstance = new MockStrategy1();
      
      authService.register(MockStrategy1, mockStrategy1);
      authService.register(MockStrategy1, newInstance);
      
      // Should not throw when trying to login with the new instance
      expect(() => {
        authService.loginWith(MockStrategy1, { username: 'test' });
      }).not.toThrow();
    });
  });

  describe('loginWith', () => {
    beforeEach(() => {
      authService.register(MockStrategy1, mockStrategy1);
      authService.register(MockStrategy2, mockStrategy2);
    });

    it('should successfully login with registered strategy', async () => {
      const result = await authService.loginWith(MockStrategy1, { username: 'testuser' });
      
      expect(result).toEqual({ token: 'token-testuser' });
    });

    it('should successfully login with different strategy', async () => {
      const result = await authService.loginWith(MockStrategy2, { email: 'test@example.com' });
      
      expect(result).toEqual({ user: { email: 'test@example.com' } });
    });

    it('should throw error when strategy is not registered', async () => {
      class UnregisteredStrategy implements AuthStrategy<any, any> {
        async login(): Promise<any> {
          return {};
        }
      }

      await expect(
        authService.loginWith(UnregisteredStrategy, {})
      ).rejects.toThrow();
    });

    it('should call the correct strategy login method', async () => {
      const loginSpy = vi.spyOn(mockStrategy1, 'login');
      
      await authService.loginWith(MockStrategy1, { username: 'testuser' });
      
      expect(loginSpy).toHaveBeenCalledWith({ username: 'testuser' });
      expect(loginSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle strategy login errors', async () => {
      const errorStrategy = new (class implements AuthStrategy<any, any> {
        async login(): Promise<any> {
          throw new Error('Login failed');
        }
      })();

      authService.register(MockStrategy1, errorStrategy);

      await expect(
        authService.loginWith(MockStrategy1, { username: 'testuser' })
      ).rejects.toThrow('Login failed');
    });
  });

  describe('integration', () => {
    it('should work with complex payload and result types', async () => {
      interface ComplexPayload {
        username: string;
        password: string;
        metadata: { ip: string; userAgent: string };
      }

      interface ComplexResult {
        user: { id: string; username: string };
        session: { token: string; expiresAt: Date };
        permissions: string[];
      }

      class ComplexStrategy implements AuthStrategy<ComplexPayload, ComplexResult> {
        async login(payload: ComplexPayload): Promise<ComplexResult> {
          return {
            user: { id: '123', username: payload.username },
            session: { token: 'complex-token', expiresAt: new Date() },
            permissions: ['read', 'write'],
          };
        }
      }

      const complexStrategy = new ComplexStrategy();
      authService.register(ComplexStrategy, complexStrategy);

      const payload: ComplexPayload = {
        username: 'testuser',
        password: 'password123',
        metadata: { ip: '127.0.0.1', userAgent: 'test-agent' },
      };

      const result = await authService.loginWith(ComplexStrategy, payload);

      expect(result.user.username).toBe('testuser');
      expect(result.session.token).toBe('complex-token');
      expect(result.permissions).toEqual(['read', 'write']);
    });
  });
}); 