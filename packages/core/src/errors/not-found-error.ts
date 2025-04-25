import { BaseError } from './base-error';

export class NotFoundError extends BaseError {
  constructor(message = 'Resource not found', code = 'NOT_FOUND') {
    super(message, code, 404);
  }
}
