import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { jwtAuthMiddleware } from '../../src/jwt/jwt.middleware';
import { JWTService } from '../../src/jwt/jwt.service';
import { UnauthorizedError } from '@domusjs/core';

describe('jwtAuthMiddleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let mockJwtService: JWTService;
  let middleware: ReturnType<typeof jwtAuthMiddleware>;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {};
    mockNext = vi.fn() as unknown as NextFunction;
    mockJwtService = {
      verify: vi.fn(),
    } as any;

    vi.mocked(container.resolve).mockReturnValue(mockJwtService);
    middleware = jwtAuthMiddleware();
  });

  describe('authorization header validation', () => {
    it('should call next with UnauthorizedError when no authorization header', () => {
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('should call next with UnauthorizedError when authorization header does not start with Bearer', () => {
      mockRequest.headers = {
        authorization: 'Basic dXNlcjpwYXNz',
      };

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('should call next with UnauthorizedError when authorization header is malformed', () => {
      mockRequest.headers = {
        authorization: 'Bearer',
      };

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('should call next with UnauthorizedError when token is empty', () => {
      mockRequest.headers = {
        authorization: 'Bearer ',
      };

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });

  describe('token verification', () => {
    beforeEach(() => {
      mockRequest.headers = {
        authorization: 'Bearer valid-token',
      };
    });

    it('should successfully verify valid token and set auth property', () => {
      const mockPayload = { userId: '123', email: 'test@example.com' };
      vi.mocked(mockJwtService.verify).mockReturnValue(mockPayload);

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockJwtService.verify).toHaveBeenCalledWith('valid-token');
      expect((mockRequest as any).auth).toEqual(mockPayload);
      expect(mockNext).toHaveBeenCalledWith();
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('should call next with UnauthorizedError when token verification fails', () => {
      vi.mocked(mockJwtService.verify).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockJwtService.verify).toHaveBeenCalledWith('valid-token');
      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('should handle different token formats', () => {
      const tokens = [
        'Bearer simple-token',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        'Bearer token-with-spaces',
      ];

      tokens.forEach((authHeader, index) => {
        mockRequest.headers = { authorization: authHeader };
        const mockPayload = { userId: `user-${index}` };
        vi.mocked(mockJwtService.verify).mockReturnValue(mockPayload);

        middleware(mockRequest as Request, mockResponse as Response, mockNext);

        const expectedToken = authHeader.split(' ')[1];
        expect(mockJwtService.verify).toHaveBeenCalledWith(expectedToken);
        expect((mockRequest as any).auth).toEqual(mockPayload);
      });
    });
  });

  describe('typed middleware', () => {
    interface UserPayload {
      userId: string;
      email: string;
      role: string;
    }

    it('should work with typed payloads', () => {
      const typedMiddleware = jwtAuthMiddleware<UserPayload>();
      mockRequest.headers = {
        authorization: 'Bearer typed-token',
      };

      const mockPayload: UserPayload = {
        userId: '123',
        email: 'test@example.com',
        role: 'admin',
      };

      vi.mocked(mockJwtService.verify).mockReturnValue(mockPayload);

      typedMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect((mockRequest as any).auth).toEqual(mockPayload);
      expect(mockNext).toHaveBeenCalledWith();
    });
  });

  describe('error handling', () => {
    beforeEach(() => {
      mockRequest.headers = {
        authorization: 'Bearer test-token',
      };
    });

    it('should handle JWT verification errors gracefully', () => {
      const jwtError = new Error('jwt expired') as any;
      jwtError.name = 'TokenExpiredError';
      vi.mocked(mockJwtService.verify).mockImplementation(() => {
        throw jwtError;
      });

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    it('should handle malformed JWT errors', () => {
      const jwtError = new Error('jwt malformed') as any;
      jwtError.name = 'JsonWebTokenError';
      vi.mocked(mockJwtService.verify).mockImplementation(() => {
        throw jwtError;
      });

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    it('should handle generic errors during verification', () => {
      vi.mocked(mockJwtService.verify).mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });

  describe('container resolution', () => {
    beforeEach(() => {
      mockRequest.headers = {
        authorization: 'Bearer test-token',
      };
    });

    it('should resolve JWTService from container', () => {
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(container.resolve).toHaveBeenCalledWith('JWTService');
    });

    it('should handle container resolution errors', () => {
      vi.mocked(container.resolve).mockImplementation(() => {
        throw new Error('Service not found');
      });

      expect(() => {
        middleware(mockRequest as Request, mockResponse as Response, mockNext);
      }).toThrow('Service not found');
    });
  });

  describe('request modification', () => {
    it('should not modify request when authorization fails', () => {
      const originalRequest = { ...mockRequest };

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRequest).toEqual(originalRequest);
    });

    it('should add auth property to request when verification succeeds', () => {
      mockRequest.headers = {
        authorization: 'Bearer valid-token',
      };
      const mockPayload = { userId: '123' };
      vi.mocked(mockJwtService.verify).mockReturnValue(mockPayload);

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect((mockRequest as any).auth).toBeDefined();
      expect((mockRequest as any).auth).toEqual(mockPayload);
    });
  });
});
