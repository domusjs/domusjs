import { AuthProvider } from './auth-provider.interface';
import { AuthResultBase } from './auth-result.interface';

export interface AuthProviderEntry<TAuthResult extends AuthResultBase = any> {
  strategy: string;
  provider: AuthProvider<any, TAuthResult>;
}