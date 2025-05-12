import { AuthProviderEntry, AuthProvider, AuthResultBase } from './';
import { injectable, inject } from 'tsyringe';

@injectable()
export class AuthService {
  private readonly strategies = new Map<string, AuthProvider<any, any>>();

  constructor(@inject('AuthProviders') providers: AuthProviderEntry[]) {
    for (const { strategy, provider } of providers) {
      this.strategies.set(strategy, provider);
    }
  }

  async login<TPayload, TResult extends AuthResultBase>(
    strategy: string,
    payload: TPayload
  ): Promise<TResult> {
    const provider = this.strategies.get(strategy);
    if (!provider) throw new Error(`Auth strategy "${strategy}" not registered`);
    return await provider.login(payload);
  }
}
