import { describe, it, expect } from 'vitest';

import { AuthStrategy, StrategyClass } from '../../src/auth-strategy.interface';

describe('AuthStrategy Interface', () => {
  describe('AuthStrategy interface', () => {
    it('should allow implementation with simple payload and result', async () => {
      class SimpleStrategy implements AuthStrategy<string, boolean> {
        async login(payload: string): Promise<boolean> {
          return payload === 'valid';
        }
      }

      const strategy = new SimpleStrategy();
      const result = await strategy.login('valid');

      expect(result).toBe(true);
    });

    it('should allow implementation with complex payload and result', async () => {
      interface LoginPayload {
        username: string;
        password: string;
        rememberMe?: boolean;
      }

      interface LoginResult {
        user: {
          id: string;
          username: string;
          email: string;
        };
        token: string;
        expiresAt: Date;
      }

      class ComplexStrategy implements AuthStrategy<LoginPayload, LoginResult> {
        async login(payload: LoginPayload): Promise<LoginResult> {
          return {
            user: {
              id: '123',
              username: payload.username,
              email: `${payload.username}@example.com`,
            },
            token: 'jwt-token',
            expiresAt: new Date(Date.now() + 3600000),
          };
        }
      }

      const strategy = new ComplexStrategy();
      const payload: LoginPayload = {
        username: 'testuser',
        password: 'password123',
        rememberMe: true,
      };

      const result = await strategy.login(payload);

      expect(result.user.username).toBe('testuser');
      expect(result.token).toBe('jwt-token');
      expect(result.expiresAt).toBeInstanceOf(Date);
    });

    it('should allow async operations in login method', async () => {
      class AsyncStrategy implements AuthStrategy<{ id: string }, { processed: boolean }> {
        async login(payload: { id: string }): Promise<{ processed: boolean }> {
          // Simulate async operation
          await new Promise((resolve) => setTimeout(resolve, 10));
          return { processed: true };
        }
      }

      const strategy = new AsyncStrategy();
      const result = await strategy.login({ id: '123' });

      expect(result.processed).toBe(true);
    });

    it('should allow error throwing in login method', async () => {
      class ErrorStrategy implements AuthStrategy<any, any> {
        async login(): Promise<any> {
          throw new Error('Authentication failed');
        }
      }

      const strategy = new ErrorStrategy();

      await expect(strategy.login()).rejects.toThrow('Authentication failed');
    });
  });

  describe('StrategyClass type', () => {
    it('should allow class constructor that implements AuthStrategy', () => {
      class TestStrategy implements AuthStrategy<string, number> {
        constructor(private multiplier: number) {}

        async login(payload: string): Promise<number> {
          return payload.length * this.multiplier;
        }
      }

      const StrategyClass: StrategyClass<string, number> = TestStrategy;
      const strategy = new StrategyClass(2);

      expect(strategy).toBeInstanceOf(TestStrategy);
    });

    it('should work with classes that have constructor parameters', () => {
      class ConfigurableStrategy implements AuthStrategy<{ value: number }, { result: number }> {
        constructor(
          private operation: 'add' | 'multiply',
          private operand: number
        ) {}

        async login(payload: { value: number }): Promise<{ result: number }> {
          const result =
            this.operation === 'add' ? payload.value + this.operand : payload.value * this.operand;

          return { result };
        }
      }

      const StrategyClass: StrategyClass<{ value: number }, { result: number }> =
        ConfigurableStrategy;
      const addStrategy = new StrategyClass('add', 5);
      const multiplyStrategy = new StrategyClass('multiply', 3);

      expect(addStrategy).toBeInstanceOf(ConfigurableStrategy);
      expect(multiplyStrategy).toBeInstanceOf(ConfigurableStrategy);
    });
  });

  describe('interface compatibility', () => {
    it('should be compatible with different payload and result types', () => {
      // Test various type combinations
      const strategies: AuthStrategy<any, any>[] = [
        new (class implements AuthStrategy<string, boolean> {
          async login(payload: string): Promise<boolean> {
            return payload.length > 0;
          }
        })(),

        new (class implements AuthStrategy<number, string> {
          async login(payload: number): Promise<string> {
            return `Number: ${payload}`;
          }
        })(),

        new (class implements AuthStrategy<{ id: string }, { token: string }> {
          async login(payload: { id: string }): Promise<{ token: string }> {
            return { token: `token-${payload.id}` };
          }
        })(),
      ];

      expect(strategies).toHaveLength(3);
      expect(strategies.every((s) => typeof s.login === 'function')).toBe(true);
    });

    it('should maintain type safety with generics', async () => {
      interface UserPayload {
        email: string;
        password: string;
      }

      interface UserResult {
        user: {
          id: string;
          email: string;
        };
        session: {
          token: string;
          expiresAt: Date;
        };
      }

      class UserAuthStrategy implements AuthStrategy<UserPayload, UserResult> {
        async login(payload: UserPayload): Promise<UserResult> {
          return {
            user: {
              id: 'user-123',
              email: payload.email,
            },
            session: {
              token: 'jwt-token',
              expiresAt: new Date(Date.now() + 3600000),
            },
          };
        }
      }

      const strategy = new UserAuthStrategy();
      const payload: UserPayload = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await strategy.login(payload);

      // TypeScript should enforce these types
      expect(result.user.email).toBe('test@example.com');
      expect(result.session.token).toBe('jwt-token');
      expect(result.session.expiresAt).toBeInstanceOf(Date);
    });
  });

  describe('real-world usage patterns', () => {
    it('should work with OAuth-like strategy', async () => {
      interface OAuthPayload {
        code: string;
        redirectUri: string;
      }

      interface OAuthResult {
        accessToken: string;
        refreshToken: string;
        user: {
          id: string;
          email: string;
          name: string;
        };
      }

      class OAuthStrategy implements AuthStrategy<OAuthPayload, OAuthResult> {
        async login(payload: OAuthPayload): Promise<OAuthResult> {
          // Simulate OAuth token exchange
          if (payload.code === 'valid-code') {
            return {
              accessToken: 'access-token-123',
              refreshToken: 'refresh-token-456',
              user: {
                id: 'user-123',
                email: 'user@example.com',
                name: 'John Doe',
              },
            };
          }
          throw new Error('Invalid authorization code');
        }
      }

      const strategy = new OAuthStrategy();
      const payload: OAuthPayload = {
        code: 'valid-code',
        redirectUri: 'http://localhost:3000/callback',
      };

      const result = await strategy.login(payload);

      expect(result.accessToken).toBe('access-token-123');
      expect(result.user.name).toBe('John Doe');
    });

    it('should work with database-backed strategy', async () => {
      interface DatabasePayload {
        username: string;
        password: string;
      }

      interface DatabaseResult {
        user: {
          id: string;
          username: string;
          role: string;
        };
        permissions: string[];
      }

      class DatabaseStrategy implements AuthStrategy<DatabasePayload, DatabaseResult> {
        async login(payload: DatabasePayload): Promise<DatabaseResult> {
          // Simulate database lookup
          if (payload.username === 'admin' && payload.password === 'admin123') {
            return {
              user: {
                id: 'admin-1',
                username: 'admin',
                role: 'administrator',
              },
              permissions: ['read', 'write', 'delete', 'admin'],
            };
          }
          throw new Error('Invalid credentials');
        }
      }

      const strategy = new DatabaseStrategy();
      const payload: DatabasePayload = {
        username: 'admin',
        password: 'admin123',
      };

      const result = await strategy.login(payload);

      expect(result.user.role).toBe('administrator');
      expect(result.permissions).toContain('admin');
    });
  });
});
