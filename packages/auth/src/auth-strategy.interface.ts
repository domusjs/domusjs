export interface AuthStrategy<TPayload, TResult> {
  login(payload: TPayload): Promise<TResult>;
}

export type StrategyClass<TPayload, TResult> = new (
  ...args: any[]
) => AuthStrategy<TPayload, TResult>;
