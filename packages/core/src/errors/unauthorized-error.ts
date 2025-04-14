import { BaseError } from './base-error';

export class UnauthorizedError extends BaseError {
  constructor(message = 'Unauthorized', code = 'UNAUTHORIZED') {
    super(message, code, 401);
  }
}
