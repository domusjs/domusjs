
import { AuthResultBase } from './auth-result.interface';

export interface AuthProvider<
  TPayload = unknown,
  TResult extends AuthResultBase = AuthResultBase
> {
  login(payload: TPayload): Promise<TResult>;
}
