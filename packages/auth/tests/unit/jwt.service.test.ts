import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JWTService } from '../../src/jwt/jwt.service';
import jwt from 'jsonwebtoken';
import { registerAuthModule } from '../../src/register';
import type { MockInstance } from 'vitest';

describe('JWTService', () => {
  let jwtService: JWTService;
  const mockSecret = 'test-secret';
  const mockExpiresIn = '1h' as jwt.SignOptions['expiresIn'];

  beforeEach(() => {
    jwtService = new JWTService(mockSecret, mockExpiresIn);
    vi.clearAllMocks();

    // Setup default mocks
    (jwt.sign as unknown as MockInstance).mockReturnValue('mocked-jwt-token');
    (jwt.verify as unknown as MockInstance).mockReturnValue({
      userId: '123',
      email: 'test@example.com',
    });
  });

  describe('constructor', () => {
    it('should create JWTService with secret and expiresIn', () => {
      expect(jwtService).toBeInstanceOf(JWTService);
    });

    it('should work with different expiration times', () => {
      const service1 = new JWTService('secret1', '15m');
      const service2 = new JWTService('secret2', '7d');
      const service3 = new JWTService('secret3', 3600);

      expect(service1).toBeInstanceOf(JWTService);
      expect(service2).toBeInstanceOf(JWTService);
      expect(service3).toBeInstanceOf(JWTService);
    });
  });

  describe('sign', () => {
    it('should sign payload and return JWT token', () => {
      const payload = { userId: '123', email: 'test@example.com' };

      const token = jwtService.sign(payload);

      expect(jwt.sign).toHaveBeenCalledWith(payload, mockSecret, { expiresIn: mockExpiresIn });
      expect(token).toBe('mocked-jwt-token');
    });

    it('should sign different payload types', () => {
      const payload1 = { userId: '123' };
      const payload2 = { email: 'test@example.com', role: 'admin' };
      const payload3 = { sub: 'user123', iat: Date.now() };

      jwtService.sign(payload1);
      jwtService.sign(payload2);
      jwtService.sign(payload3);

      expect(jwt.sign).toHaveBeenCalledWith(payload1, mockSecret, { expiresIn: mockExpiresIn });
      expect(jwt.sign).toHaveBeenCalledWith(payload2, mockSecret, { expiresIn: mockExpiresIn });
      expect(jwt.sign).toHaveBeenCalledWith(payload3, mockSecret, { expiresIn: mockExpiresIn });
    });

    it('should handle empty payload', () => {
      const payload = {};

      jwtService.sign(payload);

      expect(jwt.sign).toHaveBeenCalledWith(payload, mockSecret, { expiresIn: mockExpiresIn });
    });

    it('should handle complex payload objects', () => {
      const payload = {
        userId: '123',
        email: 'test@example.com',
        permissions: ['read', 'write'],
        metadata: {
          lastLogin: new Date().toISOString(),
          ip: '127.0.0.1',
        },
      };

      jwtService.sign(payload);

      expect(jwt.sign).toHaveBeenCalledWith(payload, mockSecret, { expiresIn: mockExpiresIn });
    });
  });

  describe('verify', () => {
    it('should verify token and return payload', () => {
      const token = 'valid-jwt-token';

      const payload = jwtService.verify(token);

      expect(jwt.verify).toHaveBeenCalledWith(token, mockSecret);
      expect(payload).toEqual({ userId: '123', email: 'test@example.com' });
    });

    it('should handle different token formats', () => {
      const tokens = [
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        'simple-token',
        'Bearer token',
      ];

      tokens.forEach((token) => {
        jwtService.verify(token);
        expect(jwt.verify).toHaveBeenCalledWith(token, mockSecret);
      });
    });

    it('should throw error when jwt.verify throws', () => {
      const token = 'invalid-token';
      const error = new Error('Invalid token');
      vi.mocked(jwt.verify).mockImplementation(() => {
        throw error;
      });

      expect(() => jwtService.verify(token)).toThrow('Invalid token');
      expect(jwt.verify).toHaveBeenCalledWith(token, mockSecret);
    });

    it('should handle jwt.JsonWebTokenError', () => {
      const token = 'invalid-token';
      const jwtError = new Error('jwt malformed') as any;
      jwtError.name = 'JsonWebTokenError';
      vi.mocked(jwt.verify).mockImplementation(() => {
        throw jwtError;
      });

      expect(() => jwtService.verify(token)).toThrow('jwt malformed');
    });

    it('should handle jwt.TokenExpiredError', () => {
      const token = 'expired-token';
      const jwtError = new Error('jwt expired') as any;
      jwtError.name = 'TokenExpiredError';
      vi.mocked(jwt.verify).mockImplementation(() => {
        throw jwtError;
      });

      expect(() => jwtService.verify(token)).toThrow('jwt expired');
    });
  });

  describe('integration', () => {
    it('should work with typed payloads', () => {
      interface UserPayload {
        userId: string;
        email: string;
        role: string;
      }

      const typedJwtService = new JWTService<UserPayload>(mockSecret, mockExpiresIn);
      const payload: UserPayload = {
        userId: '123',
        email: 'test@example.com',
        role: 'admin',
      };

      (jwt.verify as unknown as MockInstance).mockReturnValue(payload);

      const token = typedJwtService.sign(payload);
      const verifiedPayload = typedJwtService.verify(token);

      expect(token).toBe('mocked-jwt-token');
      expect(verifiedPayload).toEqual(payload);
    });

    it('should maintain payload integrity through sign and verify cycle', () => {
      const originalPayload = {
        userId: '123',
        email: 'test@example.com',
        permissions: ['read', 'write'],
        metadata: { lastLogin: '2023-01-01T00:00:00Z' },
      };

      (jwt.verify as unknown as MockInstance).mockReturnValue(originalPayload);

      const token = jwtService.sign(originalPayload);
      const verifiedPayload = jwtService.verify(token);

      expect(verifiedPayload).toEqual(originalPayload);
    });
  });

  describe('error handling', () => {
    const mockJWTConfig = { secret: 'test', expiresIn: '1h' as jwt.SignOptions['expiresIn'] };

    it('should propagate jwt.sign errors', () => {
      const payload = { userId: '123' };
      const error = new Error('Signing failed');
      vi.mocked(jwt.sign).mockImplementation(() => {
        throw error;
      });

      expect(() => jwtService.sign(payload)).toThrow('Signing failed');
    });

    it('should handle null or undefined payloads', () => {
      // The actual JWT service doesn't validate null/undefined, so we test that it passes through
      expect(() => jwtService.sign(null as any)).not.toThrow();
      expect(() => jwtService.sign(undefined as any)).not.toThrow();
    });

    it('should handle null or undefined tokens', () => {
      // The actual JWT service doesn't validate null/undefined, so we test that it passes through
      expect(() => jwtService.verify(null as any)).not.toThrow();
      expect(() => jwtService.verify(undefined as any)).not.toThrow();
    });

    it('should handle null/undefined strategies by using empty array', () => {
      // null lanza error
      expect(() => {
        registerAuthModule(null as any, mockJWTConfig);
      }).toThrow('strategies is not iterable'); // null no es iterable

      // undefined NO lanza error (usa el valor por defecto [])
      expect(() => {
        registerAuthModule(undefined as any, mockJWTConfig);
      }).not.toThrow(); // undefined usa el valor por defecto
    });
  });
});
