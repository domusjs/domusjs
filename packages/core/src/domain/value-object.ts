
/**
 * Base class for all value objects in the domain model.
 * Provides a consistent way to compare value objects and ensure equality.
 */

export abstract class ValueObject<T> {
  constructor(public readonly props: T) { }

  equals(vo?: ValueObject<T>): boolean {
      if (vo === null || vo === undefined) return false;
      return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }
}
