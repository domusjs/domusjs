import { BaseError } from './base-error';

export class ValidationError extends BaseError {
    constructor(message: string, code = 'VALIDATION_ERROR') {
        super(message, code, 422);
    }
}
