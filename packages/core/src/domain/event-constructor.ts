

import { DomainEvent } from './event';

export interface EventConstructor<E extends DomainEvent> {
  TYPE: string;
  fromJSON(data: any): E;
}
