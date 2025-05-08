import { Request } from 'express';

export interface AuthenticatedRequest<TPayload extends object> extends Request {
  auth: TPayload;
}
