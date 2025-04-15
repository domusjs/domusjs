export type Result<T, E> = Ok<T> | Err<E>;

export class Ok<T> {
  readonly isOk = true;
  readonly isErr = false;

  constructor(public readonly value: T) {}
}

export class Err<E> {
  readonly isOk = false;
  readonly isErr = true;

  constructor(public readonly error: E) {}
}

// Helpers
export const ok = <T>(value: T): Result<T, never> => new Ok(value);
export const err = <E>(error: E): Result<never, E> => new Err(error);
