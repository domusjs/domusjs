
/**
 * Middleware function type
 * @template T - Input type
 * @template R - Output type
 */
export type Middleware<T, R = any> = (
    input: T,
    next: () => Promise<R>
) => Promise<R>;
