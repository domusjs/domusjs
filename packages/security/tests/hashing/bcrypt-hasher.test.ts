import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcryptjs from 'bcryptjs';

import { BcryptHasher } from '../../src/hashing/bcrypt-hasher';

vi.mock('bcryptjs');

describe('BcryptHasher', () => {
  let hasher: BcryptHasher;
  let mockedBcryptjs: any;

  beforeEach(() => {
    mockedBcryptjs = vi.mocked(bcryptjs);
    hasher = new BcryptHasher();
    vi.clearAllMocks();
  });

  describe('hash', () => {
    it('should hash a password', async () => {
      const password = 'testpassword';
      const hashedPassword = '$2a$10$hashedpassword';

      mockedBcryptjs.hash.mockResolvedValue(hashedPassword);

      const result = await hasher.hash(password);

      expect(mockedBcryptjs.hash).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(hashedPassword);
    });
  });

  describe('compare', () => {
    it('should return true for matching password and hash', async () => {
      const password = 'testpassword';
      const hash = '$2a$10$hashedpassword';

      mockedBcryptjs.compare.mockResolvedValue(true);

      const result = await hasher.compare(password, hash);

      expect(mockedBcryptjs.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(true);
    });

    it('should return false for non-matching password and hash', async () => {
      const password = 'wrongpassword';
      const hash = '$2a$10$hashedpassword';

      mockedBcryptjs.compare.mockResolvedValue(false);

      const result = await hasher.compare(password, hash);

      expect(mockedBcryptjs.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(false);
    });
  });
});
