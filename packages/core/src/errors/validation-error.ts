import { BaseError } from './base-error';

export class ValidationError extends BaseError {
  constructor(
    message: string,
    code = 'VALIDATION_ERROR',
    readonly details?: unknown
  ) {
    super(message, code, 422);
    this.details = details;
  }
}
