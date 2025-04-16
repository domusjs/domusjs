import { BaseError } from './base-error';

export class InternalServerError extends BaseError {
  constructor(message = 'Internal Server Error', code = 'INTERNAL_SERVER_ERROR') {
    super(message, code, 500);
  }
}
