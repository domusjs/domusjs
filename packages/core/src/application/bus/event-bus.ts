import { DomainEvent } from '../../domain/event';
import { EventHandler } from '../handler';

export interface EventBus {
  publish(events: DomainEvent[]): Promise<void>;
  subscribe(): Promise<void>;
}
