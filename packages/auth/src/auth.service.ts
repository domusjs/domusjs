import { JWTService } from './jwt/jwt.service';
import { AuthProviderEntry, AuthProvider, AuthResultBase } from './';

export class AuthService<TResult extends AuthResultBase = AuthResultBase> {
  private readonly strategies = new Map<string, AuthProvider<any, TResult>>();

  constructor(
    providers: AuthProviderEntry<TResult>[],
    private readonly jwt: JWTService<TResult>
  ) {
    for (const { strategy, provider } of providers) {
      this.strategies.set(strategy, provider);
    }
  }

  async login<TPayload>(strategy: string, payload: TPayload): Promise<string> {
    const provider = this.strategies.get(strategy);
    if (!provider) throw new Error(`Auth strategy "${strategy}" not registered`);
    const result = await provider.login(payload);
    return this.jwt.sign(result);
  }
}
