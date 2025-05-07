import { AuthProviderEntry, AuthProvider, AuthResultBase } from './';

export class AuthService<TResult extends AuthResultBase = AuthResultBase> {
  private readonly strategies = new Map<string, AuthProvider<any, TResult>>();

  constructor(providers: AuthProviderEntry<TResult>[]) {
    for (const { strategy, provider } of providers) {
      this.strategies.set(strategy, provider);
    }
  }

  async login<TPayload>(strategy: string, payload: TPayload): Promise<TResult> {
    const provider = this.strategies.get(strategy);
    if (!provider) throw new Error(`Auth strategy "${strategy}" not registered`);
    return await provider.login(payload);
  }
}
