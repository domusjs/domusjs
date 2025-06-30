import { describe, it, expect } from 'vitest';
import { Request } from 'express';

import { AuthenticatedRequest } from '../../src/jwt/authenticated-request.interface';

describe('AuthenticatedRequest Interface', () => {
  describe('interface structure', () => {
    it('should extend Express Request interface', () => {
      // This test verifies that AuthenticatedRequest is compatible with Request
      const mockRequest: Partial<Request> = {
        method: 'GET',
        url: '/test',
        headers: {},
      };

      // Should be able to assign to AuthenticatedRequest
      const authenticatedRequest: AuthenticatedRequest<{ userId: string }> = {
        ...mockRequest,
        auth: { userId: '123' },
      } as AuthenticatedRequest<{ userId: string }>;

      expect(authenticatedRequest.method).toBe('GET');
      expect(authenticatedRequest.url).toBe('/test');
      expect(authenticatedRequest.auth).toEqual({ userId: '123' });
    });

    it('should have auth property with correct type', () => {
      interface UserPayload {
        userId: string;
        email: string;
        role: string;
      }

      const authenticatedRequest: AuthenticatedRequest<UserPayload> = {
        method: 'POST',
        url: '/login',
        headers: {},
        auth: {
          userId: '123',
          email: 'test@example.com',
          role: 'admin',
        },
      } as AuthenticatedRequest<UserPayload>;

      expect(authenticatedRequest.auth.userId).toBe('123');
      expect(authenticatedRequest.auth.email).toBe('test@example.com');
      expect(authenticatedRequest.auth.role).toBe('admin');
    });
  });

  describe('type safety', () => {
    it('should enforce auth property type constraints', () => {
      interface SimplePayload {
        id: string;
      }

      // This should compile without errors
      const request: AuthenticatedRequest<SimplePayload> = {
        method: 'GET',
        url: '/',
        headers: {},
        auth: { id: '123' },
      } as AuthenticatedRequest<SimplePayload>;

      expect(request.auth.id).toBe('123');
    });

    it('should work with complex payload types', () => {
      interface ComplexPayload {
        user: {
          id: string;
          username: string;
          permissions: string[];
        };
        session: {
          token: string;
          expiresAt: Date;
        };
        metadata: {
          ip: string;
          userAgent: string;
        };
      }

      const request: AuthenticatedRequest<ComplexPayload> = {
        method: 'GET',
        url: '/api/user',
        headers: {},
        auth: {
          user: {
            id: 'user-123',
            username: 'testuser',
            permissions: ['read', 'write'],
          },
          session: {
            token: 'jwt-token',
            expiresAt: new Date(),
          },
          metadata: {
            ip: '127.0.0.1',
            userAgent: 'test-agent',
          },
        },
      } as AuthenticatedRequest<ComplexPayload>;

      expect(request.auth.user.username).toBe('testuser');
      expect(request.auth.session.token).toBe('jwt-token');
      expect(request.auth.metadata.ip).toBe('127.0.0.1');
    });
  });

  describe('compatibility with Express middleware', () => {
    it('should be compatible with Express middleware signature', () => {
      // Simulate middleware function that expects AuthenticatedRequest
      const middleware = (req: AuthenticatedRequest<{ userId: string }>, res: any, next: any) => {
        expect(req.auth.userId).toBe('123');
        next();
      };

      const mockRequest: AuthenticatedRequest<{ userId: string }> = {
        method: 'GET',
        url: '/protected',
        headers: {},
        auth: { userId: '123' },
      } as AuthenticatedRequest<{ userId: string }>;

      const mockResponse = {};
      const mockNext = () => {};

      // Should be able to call middleware with AuthenticatedRequest
      expect(() => {
        middleware(mockRequest, mockResponse, mockNext);
      }).not.toThrow();
    });

    it('should work with generic middleware functions', () => {
      // Generic middleware that can work with any auth payload
      const genericMiddleware = <T extends object>(
        req: AuthenticatedRequest<T>,
        res: any,
        next: any
      ) => {
        expect(req.auth).toBeDefined();
        next();
      };

      const request1: AuthenticatedRequest<{ userId: string }> = {
        method: 'GET',
        url: '/',
        headers: {},
        auth: { userId: '123' },
      } as AuthenticatedRequest<{ userId: string }>;

      const request2: AuthenticatedRequest<{ email: string }> = {
        method: 'POST',
        url: '/',
        headers: {},
        auth: { email: 'test@example.com' },
      } as AuthenticatedRequest<{ email: string }>;

      const mockResponse = {};
      const mockNext = () => {};

      expect(() => {
        genericMiddleware(request1, mockResponse, mockNext);
        genericMiddleware(request2, mockResponse, mockNext);
      }).not.toThrow();
    });
  });

  describe('real-world usage scenarios', () => {
    it('should work with JWT middleware integration', () => {
      // Simulate JWT middleware that adds auth to request
      const jwtMiddleware = (req: Request, res: any, next: any) => {
        (req as AuthenticatedRequest<{ userId: string }>).auth = {
          userId: '123',
        };
        next();
      };

      const mockRequest: Partial<Request> = {
        method: 'GET',
        url: '/protected',
        headers: { authorization: 'Bearer token' },
      };

      const mockResponse = {};
      const mockNext = () => {};

      jwtMiddleware(mockRequest as Request, mockResponse, mockNext);

      const authenticatedRequest = mockRequest as AuthenticatedRequest<{ userId: string }>;
      expect(authenticatedRequest.auth.userId).toBe('123');
    });

    it('should work with role-based access control', () => {
      interface UserAuth {
        userId: string;
        role: 'admin' | 'user' | 'moderator';
        permissions: string[];
      }

      const roleMiddleware = (req: AuthenticatedRequest<UserAuth>, res: any, next: any) => {
        if (req.auth.role === 'admin') {
          next();
        } else {
          res.status(403).json({ error: 'Forbidden' });
        }
      };

      const adminRequest: AuthenticatedRequest<UserAuth> = {
        method: 'DELETE',
        url: '/admin/users',
        headers: {},
        auth: {
          userId: 'admin-1',
          role: 'admin',
          permissions: ['read', 'write', 'delete'],
        },
      } as AuthenticatedRequest<UserAuth>;

      const userRequest: AuthenticatedRequest<UserAuth> = {
        method: 'GET',
        url: '/profile',
        headers: {},
        auth: {
          userId: 'user-1',
          role: 'user',
          permissions: ['read'],
        },
      } as AuthenticatedRequest<UserAuth>;

      const mockResponse = {
        status: (code: number) => ({ json: (data: any) => data }),
      };
      const mockNext = () => {};

      // Admin should pass
      expect(() => {
        roleMiddleware(adminRequest, mockResponse, mockNext);
      }).not.toThrow();

      // User should be forbidden
      expect(() => {
        roleMiddleware(userRequest, mockResponse, mockNext);
      }).not.toThrow();
    });
  });

  describe('edge cases', () => {
    it('should work with empty object payload', () => {
      const request: AuthenticatedRequest<{}> = {
        method: 'GET',
        url: '/',
        headers: {},
        auth: {},
      } as AuthenticatedRequest<{}>;

      expect(request.auth).toEqual({});
    });

    it('should work with optional properties in payload', () => {
      interface OptionalPayload {
        userId: string;
        email?: string;
        preferences?: {
          theme: string;
          language: string;
        };
      }

      const request: AuthenticatedRequest<OptionalPayload> = {
        method: 'GET',
        url: '/',
        headers: {},
        auth: {
          userId: '123',
          email: 'test@example.com',
          preferences: {
            theme: 'dark',
            language: 'en',
          },
        },
      } as AuthenticatedRequest<OptionalPayload>;

      expect(request.auth.userId).toBe('123');
      expect(request.auth.email).toBe('test@example.com');
      expect(request.auth.preferences?.theme).toBe('dark');
    });
  });
});
