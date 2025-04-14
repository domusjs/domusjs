import { BaseError } from './base-error';

export class DomainError extends BaseError {
  constructor(message: string, code = 'DOMAIN_ERROR') {
    super(message, code, 400);
  }
}
