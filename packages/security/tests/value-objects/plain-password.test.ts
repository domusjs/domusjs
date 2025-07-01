import { describe, it, expect } from 'vitest';
import { PlainPassword } from '../../src/value-objects/plain-password';

describe('PlainPassword', () => {
  describe('create', () => {
    it('should create a PlainPassword with valid password', () => {
      const password = 'validpassword123';
      const plainPassword = PlainPassword.create(password);
      
      expect(plainPassword).toBeInstanceOf(PlainPassword);
      expect(plainPassword.getValue()).toBe(password);
    });

    it('should throw error for empty string', () => {
      expect(() => PlainPassword.create('')).toThrow('[PlainPassword] Password must be a non-empty string');
    });

    it('should throw error for whitespace-only string', () => {
      expect(() => PlainPassword.create('   ')).toThrow('[PlainPassword] Password must be a non-empty string');
    });

    it('should throw error for null value', () => {
      expect(() => PlainPassword.create(null as any)).toThrow('[PlainPassword] Password must be a non-empty string');
    });

    it('should throw error for undefined value', () => {
      expect(() => PlainPassword.create(undefined as any)).toThrow('[PlainPassword] Password must be a non-empty string');
    });

    it('should throw error for non-string value', () => {
      expect(() => PlainPassword.create(123 as any)).toThrow('[PlainPassword] Password must be a non-empty string');
    });

    it('should throw error for password too short', () => {
      expect(() => PlainPassword.create('12345')).toThrow('[PlainPassword] Password does not meet validation requirements');
    });

    it('should throw error for password too long', () => {
      const longPassword = 'a'.repeat(65);
      expect(() => PlainPassword.create(longPassword)).toThrow('[PlainPassword] Password does not meet validation requirements');
    });

    it('should accept minimum length password', () => {
      const password = '123456';
      const plainPassword = PlainPassword.create(password);
      
      expect(plainPassword).toBeInstanceOf(PlainPassword);
      expect(plainPassword.getValue()).toBe(password);
    });

    it('should accept maximum length password', () => {
      const password = 'a'.repeat(64);
      const plainPassword = PlainPassword.create(password);
      
      expect(plainPassword).toBeInstanceOf(PlainPassword);
      expect(plainPassword.getValue()).toBe(password);
    });

    it('should use custom validation function', () => {
      const customValidation = (value: string) => value.includes('@');
      const password = 'test@password';
      
      const plainPassword = PlainPassword.create(password, customValidation);
      
      expect(plainPassword).toBeInstanceOf(PlainPassword);
      expect(plainPassword.getValue()).toBe(password);
    });

    it('should throw error when custom validation fails', () => {
      const customValidation = (value: string) => value.includes('@');
      const password = 'testpassword';
      
      expect(() => PlainPassword.create(password, customValidation)).toThrow('[PlainPassword] Password does not meet validation requirements');
    });
  });

  describe('getValue', () => {
    it('should return the password value', () => {
      const password = 'testpassword123';
      const plainPassword = PlainPassword.create(password);
      
      expect(plainPassword.getValue()).toBe(password);
    });
  });
}); 