export type TResult<T, E> = Ok<T> | Err<E>;

export class Ok<T> {
  constructor(public readonly value: T) {}

  // Instance methods
  isOk(): this is Ok<T> {
    return true;
  }

  isErr(): this is Err<never> {
    return false;
  }
}

export class Err<E> {
  constructor(public readonly error: E) {}

  // Instance methods
  isOk(): this is Ok<never> {
    return false;
  }

  isErr(): this is Err<E> {
    return true;
  }
}

// Static methods on Result type
export namespace Result {
  export const ok = <T>(value: T): TResult<T, never> => new Ok(value);
  export const fail = <E>(error: E): TResult<never, E> => new Err(error);
}
