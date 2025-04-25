/**
 * Represents a domain event that can be used to trigger actions or updates in the domain model.
 *
 * @interface DomainEvent
 * @property {string} type - The type of the event.
 * @property {Date} occurredAt - The date and time when the event occurred.
 */
export interface DomainEvent {
  readonly type: string;
  readonly occurredAt: Date;
}
