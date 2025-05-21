import { AuthStrategy, StrategyClass } from './auth-strategy.interface';

export class AuthService {
  private readonly strategies = new Map<Function, AuthStrategy<any, any>>();

  register<TPayload, TResult>(
    strategy: StrategyClass<TPayload, TResult>,
    instance: AuthStrategy<TPayload, TResult>
  ): void {
    this.strategies.set(strategy, instance);
  }

  loginWith<TPayload, TResult>(
    strategy: StrategyClass<TPayload, TResult>,
    payload: TPayload
  ): Promise<TResult> {
    const provider = this.strategies.get(strategy);

    if (!provider) {
      throw new Error(`Auth strategy not registered`);
    }

    return (provider as AuthStrategy<TPayload, TResult>).login(payload);
  }
}
