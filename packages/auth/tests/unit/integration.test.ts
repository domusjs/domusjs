import { describe, it, expect, beforeEach, vi } from 'vitest';
import { container } from 'tsyringe';
import { registerAuthModule, JWTConfig } from '../../src/register';
import { AuthService } from '../../src/auth.service';
import { JWTService } from '../../src/jwt/jwt.service';
import { jwtAuthMiddleware } from '../../src/jwt/jwt.middleware';
import { AuthStrategy } from '../../src/auth-strategy.interface';
import { Request, Response, NextFunction } from 'express';

// Mock strategy for integration testing
class IntegrationTestStrategy implements AuthStrategy<{ username: string; password: string }, { token: string; user: any }> {
  async login(payload: { username: string; password: string }): Promise<{ token: string; user: any }> {
    if (payload.username === 'testuser' && payload.password === 'password123') {
      return {
        token: 'integration-test-token',
        user: {
          id: 'user-123',
          username: payload.username,
          email: `${payload.username}@example.com`,
        },
      };
    }
    throw new Error('Invalid credentials');
  }
}

describe('Auth Module Integration', () => {
  let authService: AuthService;
  let jwtService: JWTService;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup test configuration
    const jwtConfig: JWTConfig = {
      secret: 'integration-test-secret',
      expiresIn: '1h',
    };

    const strategies = [
      { strategy: IntegrationTestStrategy, instance: new IntegrationTestStrategy() },
    ];

    // Register the module
    registerAuthModule(strategies, jwtConfig);

    // Get registered services
    const jwtServiceCall = vi.mocked(container.register).mock.calls.find(
      call => call[0] === 'JWTService'
    );
    const authServiceCall = vi.mocked(container.register).mock.calls.find(
      call => call[0] === 'AuthService'
    );

    jwtService = (jwtServiceCall?.[1] as any)?.useValue as JWTService;
    authService = (authServiceCall?.[1] as any)?.useValue as AuthService;

    // Setup mock request/response for middleware testing
    mockRequest = {
      headers: {},
    };
    mockResponse = {};
    mockNext = vi.fn() as unknown as NextFunction;
  });

  describe('Complete Authentication Flow', () => {
    it('should handle complete login and JWT verification flow', async () => {
      // Step 1: Login with strategy
      const loginPayload = { username: 'testuser', password: 'password123' };
      const loginResult = await authService.loginWith(IntegrationTestStrategy, loginPayload);

      expect(loginResult).toEqual({
        token: 'integration-test-token',
        user: {
          id: 'user-123',
          username: 'testuser',
          email: 'testuser@example.com',
        },
      });

      // Step 2: Sign JWT with user data
      const jwtPayload = {
        userId: loginResult.user.id,
        username: loginResult.user.username,
        email: loginResult.user.email,
      };

      // Mock JWT signing - we need to mock the actual JWTService methods
      const mockSign = vi.fn().mockReturnValue('signed-jwt-token');
      const mockVerify = vi.fn().mockReturnValue(jwtPayload);
      
      // Replace the methods on the actual service instance
      jwtService.sign = mockSign;
      jwtService.verify = mockVerify;

      const jwtToken = jwtService.sign(jwtPayload);
      expect(jwtToken).toBe('signed-jwt-token');

      // Step 3: Verify JWT in middleware
      mockRequest.headers = {
        authorization: `Bearer ${jwtToken}`,
      };

      // Mock container resolution
      vi.mocked(container.resolve).mockReturnValue(jwtService);

      const middleware = jwtAuthMiddleware();
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect((mockRequest as any).auth).toEqual(jwtPayload);
    });

    it('should handle authentication failure scenarios', async () => {
      // Test invalid login credentials
      const invalidPayload = { username: 'wronguser', password: 'wrongpass' };

      await expect(
        authService.loginWith(IntegrationTestStrategy, invalidPayload)
      ).rejects.toThrow('Invalid credentials');

      // Test invalid JWT token in middleware
      mockRequest.headers = {
        authorization: 'Bearer invalid-token',
      };

      const mockVerify = vi.fn().mockImplementation(() => {
        throw new Error('Invalid token');
      });
      jwtService.verify = mockVerify;
      vi.mocked(container.resolve).mockReturnValue(jwtService);

      const middleware = jwtAuthMiddleware();
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('Service Registration and Resolution', () => {
    it('should register services correctly in container', () => {
      expect(container.register).toHaveBeenCalledWith('JWTService', {
        useValue: expect.any(JWTService),
      });
      expect(container.register).toHaveBeenCalledWith('AuthService', {
        useValue: expect.any(AuthService),
      });
    });

    it('should resolve services correctly from container', () => {
      const jwtServiceCall = vi.mocked(container.register).mock.calls.find(
        call => call[0] === 'JWTService'
      );
      const authServiceCall = vi.mocked(container.register).mock.calls.find(
        call => call[0] === 'AuthService'
      );

      const registeredJwtService = (jwtServiceCall?.[1] as any)?.useValue as JWTService;
      const registeredAuthService = (authServiceCall?.[1] as any)?.useValue as AuthService;

      expect(registeredJwtService).toBeInstanceOf(JWTService);
      expect(registeredAuthService).toBeInstanceOf(AuthService);
    });
  });

  describe('Strategy Integration', () => {
    it('should work with multiple strategies', async () => {
      // Create additional strategy
      class SecondStrategy implements AuthStrategy<{ email: string }, { accessToken: string }> {
        async login(payload: { email: string }): Promise<{ accessToken: string }> {
          return { accessToken: `access-${payload.email}` };
        }
      }

      // Create a new AuthService with both strategies
      const multiAuthService = new AuthService();
      multiAuthService.register(IntegrationTestStrategy, new IntegrationTestStrategy());
      multiAuthService.register(SecondStrategy, new SecondStrategy());

      // Test both strategies work
      const result1 = await multiAuthService.loginWith(IntegrationTestStrategy, {
        username: 'testuser',
        password: 'password123',
      });

      const result2 = await multiAuthService.loginWith(SecondStrategy, {
        email: 'test@example.com',
      });

      expect(result1.token).toBe('integration-test-token');
      expect(result2.accessToken).toBe('access-test@example.com');
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle strategy errors properly', async () => {
      class ErrorStrategy implements AuthStrategy<any, any> {
        async login(): Promise<any> {
          throw new Error('Strategy error');
        }
      }

      const errorAuthService = new AuthService();
      errorAuthService.register(ErrorStrategy, new ErrorStrategy());

      await expect(
        errorAuthService.loginWith(ErrorStrategy, {})
      ).rejects.toThrow('Strategy error');
    });

    it('should handle JWT verification errors in middleware', () => {
      mockRequest.headers = {
        authorization: 'Bearer expired-token',
      };

      // Mock expired token error
      const jwtError = new Error('jwt expired') as any;
      jwtError.name = 'TokenExpiredError';
      const mockVerify = vi.fn().mockImplementation(() => {
        throw jwtError;
      });
      jwtService.verify = mockVerify;
      vi.mocked(container.resolve).mockReturnValue(jwtService);

      const middleware = jwtAuthMiddleware();
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('Type Safety Integration', () => {
    it('should maintain type safety across the entire flow', async () => {
      interface TypedPayload {
        userId: string;
        role: string;
      }

      interface TypedResult {
        session: {
          token: string;
          expiresAt: Date;
        };
      }

      class TypedStrategy implements AuthStrategy<TypedPayload, TypedResult> {
        async login(payload: TypedPayload): Promise<TypedResult> {
          return {
            session: {
              token: `typed-token-${payload.userId}`,
              expiresAt: new Date(Date.now() + 3600000),
            },
          };
        }
      }

      const typedAuthService = new AuthService();
      typedAuthService.register(TypedStrategy, new TypedStrategy());

      const payload: TypedPayload = {
        userId: 'typed-user-123',
        role: 'admin',
      };

      const result = await typedAuthService.loginWith(TypedStrategy, payload);

      expect(result.session.token).toBe('typed-token-typed-user-123');
      expect(result.session.expiresAt).toBeInstanceOf(Date);
    });
  });
}); 