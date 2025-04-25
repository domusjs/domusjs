export interface Tracer {
  startSpan<T>(name: string, fn: () => Promise<T>): Promise<T>;
}
