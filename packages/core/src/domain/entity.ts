/**
 * Abstract base class for all entities in the domain model.
 *
 * This class provides a consistent way to identify and manage entities
 * by ensuring that each entity has a unique set of properties.
 *
 * @template T - The type of the properties that define the entity.
 *
 * @remarks
 * Entities are objects that are distinguished by their identity rather than their attributes.
 * This base class ensures that all entities have a consistent structure and behavior.
 */

import { UniqueEntityId } from '../value-objects/unique-entity-id';

export abstract class Entity<T> {
  protected readonly _id: UniqueEntityId;

  protected constructor(
    public readonly props: T,
    id?: UniqueEntityId
  ) {
    this._id = id ?? new UniqueEntityId();
    this.props = props;
  }

  get id(): UniqueEntityId {
    return this._id;
  }
}
